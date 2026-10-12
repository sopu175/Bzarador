import ZAI from "z-ai-web-dev-sdk";
import { db } from "./db";

/**
 * Live price fetcher for Bangladesh kitchen markets.
 *
 * Pipeline:
 *   1. Run several targeted web searches for current BD market prices
 *      (one per category + one general).
 *   2. Collect the rich snippets from every result. Snippets often already
 *      contain price data (e.g. "পেঁয়াজ ৮০-৯০ টাকা").
 *   3. Try to page_reader the top 2 accessible (non-Cloudflare) pages
 *      for fuller content.
 *   4. Feed all collected text + our full item list to the LLM and ask it
 *      to return a JSON array of { nameBn, price, unit, market, source }.
 *   5. Match each extracted price to an Item by name; create PriceReports
 *      tagged with sourceName + sourceUrl.
 */

type SearchHit = {
  url: string;
  name: string;
  snippet: string;
  host_name: string;
  date?: string;
};

type ExtractedPrice = {
  nameBn: string;
  price: number; // representative price in Taka (midpoint of a range)
  unit: string;
  market?: string;
  source: string;
};

const SEARCH_QUERIES = [
  "আজকের বাজার দাম কারওয়ান বাজার শাকসবজি মাছ মাংস ২০২৫",
  "Bangladesh kitchen market price today Dhaka vegetables fish",
  "আজকের বাজার দর ধানমন্ডি মিরপুর চাল ডাল তেল টাকা",
  "ajker bazar dam dhaka potato onion tomato price today taka",
  "আজকের বাজার মূল্য গরুর মাংস মুরগি ইলিশ রুই মাছ দাম",
];

// Pages we won't even try to read (known to be behind Cloudflare / JS walls)
const BLOCKED_HOSTS = [
  "facebook.com",
  "ittefaq.com.bd",
  "prothomalo.com",
];

async function search(query: string, num: number, recencyDays?: number): Promise<SearchHit[]> {
  const zai = await ZAI.create();
  const args: { query: string; num: number; recency_days?: number } = { query, num };
  if (recencyDays) args.recency_days = recencyDays;
  try {
    const res = (await zai.functions.invoke("web_search", args)) as SearchHit[];
    return Array.isArray(res) ? res : [];
  } catch (e) {
    console.error("[live-prices] search failed:", query, e);
    return [];
  }
}

async function readPage(url: string): Promise<{ title: string; text: string } | null> {
  const zai = await ZAI.create();
  try {
    const result = await zai.functions.invoke("page_reader", { url });
    const data = (result as any)?.data;
    const html: string = data?.html ?? "";
    if (!html || html.length < 200) return null;
    // Strip HTML → plain text, collapse whitespace
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ")
      .trim();
    return { title: data?.title ?? "", text };
  } catch (e) {
    console.error("[live-prices] page_reader failed:", url, (e as Error).message);
    return null;
  }
}

async function extractPricesWithLLM(
  corpus: string,
  items: { id: string; nameBn: string; nameEn: string; category: string; unit: string }[]
): Promise<ExtractedPrice[]> {
  const zai = await ZAI.create();
  const itemCatalog = items
    .map((i) => `${i.nameBn} (${i.nameEn}) [${i.category}, per ${i.unit}]`)
    .join("\n");

  const prompt = `You are a price extraction assistant for Bangladesh kitchen markets.

Below is a corpus of recent web content (search snippets + article text) about today's kitchen market prices in Bangladesh, in Bengali and English.

Your task: extract current retail prices for kitchen items mentioned. Match them to the catalog below when possible.

CATALOG OF KNOWN ITEMS (nameBn (nameEn) [category, per unit]):
${itemCatalog}

Return ONLY a JSON array (no markdown, no commentary). Each element must be:
{
  "nameBn": "<Bengali item name from the catalog if matched, else the raw name from the article>",
  "price": <number, representative retail price in Bangladeshi Taka per the unit; if a range is given use the midpoint>,
  "unit": "<kg | piece | litre | dozen — from the catalog if matched, else infer>",
  "market": "<market name in Bengali if mentioned, e.g. কারওয়ান বাজার, else omit>",
  "source": "<short source name, e.g. The Daily Star, Jago News 24, Dhaka Post, DAM>"
}

Rules:
- Only include items you actually found a price for in the corpus.
- Prices must be realistic current Bangladesh retail prices (typically 25–2000 ৳/unit).
- If the corpus mentions a price range, use the midpoint rounded to the nearest integer.
- Do not invent prices. If unsure, omit the item.
- Return at most 30 items.

CORPUS:
${corpus.slice(0, 18000)}`;

  const completion = await zai.chat.completions.create({
    messages: [
      {
        role: "assistant",
        content:
          "You extract structured price data from Bengali/English market news. You always respond with valid JSON only — no prose, no code fences.",
      },
      { role: "user", content: prompt },
    ],
    thinking: { type: "disabled" },
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  // Tolerate accidental markdown fences
  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*$/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed as ExtractedPrice[];
    if (parsed && typeof parsed === "object") return [parsed as ExtractedPrice];
    return [];
  } catch (e) {
    // Try to salvage an embedded JSON array
    const m = cleaned.match(/\[[\s\S]*\]/);
    if (m) {
      try {
        return JSON.parse(m[0]) as ExtractedPrice[];
      } catch {
        /* ignore */
      }
    }
    console.error("[live-prices] LLM JSON parse failed. Raw:", cleaned.slice(0, 500));
    return [];
  }
}

/** Build a representative market in Dhaka to attach live prices to (defaults to Karwan Bazar). */
async function getDefaultMarketId(): Promise<string> {
  const kb = await db.market.findFirst({ where: { nameEn: "Karwan Bazar" } });
  if (kb) return kb.id;
  const any = await db.market.findFirst();
  if (any) return any.id;
  // Should never happen — seed guarantees markets exist
  throw new Error("No markets in DB");
}

/**
 * Run a full live-price refresh. Returns a summary.
 */
export async function refreshLivePrices(): Promise<{
  itemsFetched: number;
  sourcesUsed: string[];
  logId: string;
}> {
  // Create a running log entry
  const log = await db.liveFetchLog.create({ data: { status: "running", sourcesUsed: "" } });

  try {
    // 1. Multi-query search (recent results preferred)
    const searches = await Promise.all(
      SEARCH_QUERIES.map((q) => search(q, 8, 7))
    );
    const allHits: SearchHit[] = [];
    const sourceSet = new Set<string>();
    for (const list of searches) {
      for (const h of list) {
        allHits.push(h);
        if (h.host_name) sourceSet.add(h.host_name);
      }
    }
    // Deduplicate by URL
    const seenUrl = new Set<string>();
    const hits = allHits.filter((h) => {
      if (seenUrl.has(h.url)) return false;
      seenUrl.add(h.url);
      return true;
    });

    // 2. Build corpus from snippets
    const snippetCorpus = hits
      .map((h) => `[${h.host_name}] ${h.name}\n${h.snippet}`)
      .join("\n\n");

    // 3. Try to read the top 3 accessible pages for fuller text
    const readableCandidates = hits
      .filter((h) => !BLOCKED_HOSTS.some((b) => h.host_name.includes(b)))
      .slice(0, 3);
    const pageTexts = await Promise.all(readableCandidates.map((h) => readPage(h.url)));
    const pageCorpus = readableCandidates
      .map((h, i) => {
        const t = pageTexts[i];
        return t ? `[${h.host_name}] ${t.title}\n${t.text.slice(0, 4000)}` : "";
      })
      .filter(Boolean)
      .join("\n\n");

    const corpus = `${snippetCorpus}\n\n--- ARTICLE TEXT ---\n${pageCorpus}`;

    if (corpus.trim().length < 100) {
      throw new Error("No usable price content fetched from the web");
    }

    // 4. Extract structured prices with the LLM
    const items = await db.item.findMany();
    const extracted = await extractPricesWithLLM(corpus, items);

    if (extracted.length === 0) {
      throw new Error("LLM could not extract any prices from fetched content");
    }

    // 5. Match extracted prices to our Item table by Bengali name (fallback to English)
    const itemsByBn = new Map(items.map((i) => [i.nameBn.trim(), i]));
    const itemsByEn = new Map(items.map((i) => [i.nameEn.toLowerCase(), i]));

    const defaultMarketId = await getDefaultMarketId();
    const dhakaMarkets = await db.market.findMany({ where: { district: "Dhaka" } });

    const reportsToCreate: {
      itemId: string;
      marketId: string;
      price: number;
      reporterName: string;
      sourceName: string;
      sourceUrl: string | null;
    }[] = [];

    const usedSources = new Set<string>();

    for (const ep of extracted) {
      const key = ep.nameBn.trim();
      let item = itemsByBn.get(key);
      if (!item) {
        // Fuzzy fallback: try lowercase English
        item = itemsByEn.get(ep.nameBn.toLowerCase());
      }
      if (!item) {
        // Try partial match on Bengali name
        for (const it of items) {
          if (it.nameBn.includes(key) || key.includes(it.nameBn)) {
            item = it;
            break;
          }
        }
      }
      if (!item) continue;
      if (!ep.price || ep.price <= 0 || ep.price > 100000) continue;

      // Pick a market: prefer the one mentioned in the article, else a Dhaka market, else default
      let marketId = defaultMarketId;
      if (ep.market) {
        const matched = dhakaMarkets.find(
          (m) => m.nameBn.includes(ep.market!) || ep.market!.includes(m.nameBn)
        );
        if (matched) marketId = matched.id;
      }

      const sourceLabel = ep.source || "Web";
      usedSources.add(sourceLabel);
      reportsToCreate.push({
        itemId: item.id,
        marketId,
        price: Math.round(ep.price),
        reporterName: `Live: ${sourceLabel}`,
        sourceName: sourceLabel,
        sourceUrl: readableCandidates.find((c) =>
          c.host_name.toLowerCase().includes(sourceLabel.toLowerCase().split(" ")[0])
        )?.url ?? null,
      });
    }

    if (reportsToCreate.length === 0) {
      throw new Error("No extracted prices matched items in our catalog");
    }

    // 6. Persist (use a transaction for atomicity)
    await db.$transaction(
      reportsToCreate.map((r) =>
        db.priceReport.create({
          data: {
            itemId: r.itemId,
            marketId: r.marketId,
            price: r.price,
            reporterName: r.reporterName,
            sourceName: r.sourceName,
            sourceUrl: r.sourceUrl,
            reportedAt: new Date(),
          },
        })
      )
    );

    const sourcesUsed = Array.from(usedSources);

    await db.liveFetchLog.update({
      where: { id: log.id },
      data: {
        status: "done",
        finishedAt: new Date(),
        itemsFetched: reportsToCreate.length,
        sourcesUsed: sourcesUsed.join(", "),
      },
    });

    return {
      itemsFetched: reportsToCreate.length,
      sourcesUsed,
      logId: log.id,
    };
  } catch (e) {
    const msg = (e as Error).message;
    await db.liveFetchLog.update({
      where: { id: log.id },
      data: { status: "error", finishedAt: new Date(), error: msg.slice(0, 500) },
    });
    throw e;
  }
}

/**
 * Fetch a live price for a single item by name (used by the per-item "fetch live" button).
 */
export async function refreshLivePriceForItem(itemId: string): Promise<{
  price: number;
  sourceName: string;
  sourceUrl: string | null;
}> {
  const item = await db.item.findUnique({ where: { id: itemId } });
  if (!item) throw new Error("Item not found");

  const q = `আজকের ${item.nameBn} ${item.nameEn} দাম বাংলাদেশ বাজার টাকা`;
  const hits = await search(q, 6, 14);
  const snippetCorpus = hits
    .map((h) => `[${h.host_name}] ${h.name}\n${h.snippet}`)
    .join("\n\n");

  const readable = hits
    .filter((h) => !BLOCKED_HOSTS.some((b) => h.host_name.includes(b)))
    .slice(0, 2);
  const pageTexts = await Promise.all(readable.map((h) => readPage(h.url)));
  const pageCorpus = readable
    .map((h, i) => {
      const t = pageTexts[i];
      return t ? `[${h.host_name}] ${t.title}\n${t.text.slice(0, 3000)}` : "";
    })
    .filter(Boolean)
    .join("\n\n");

  const corpus = `${snippetCorpus}\n\n--- ARTICLE TEXT ---\n${pageCorpus}`;
  if (corpus.trim().length < 80) throw new Error("No live content found for this item");

  const extracted = await extractPricesWithLLM(corpus, [item]);
  if (extracted.length === 0) throw new Error("Could not extract a live price");

  // Pick the first extracted entry whose name matches our item (or just the first)
  const match =
    extracted.find((e) => e.nameBn.includes(item.nameBn) || item.nameBn.includes(e.nameBn)) ??
    extracted[0];

  const price = Math.round(match.price);
  if (!price || price <= 0 || price > 100000) throw new Error("Extracted price out of range");

  const sourceName = match.source || "Web";
  const sourceUrl =
    readable.find((h) =>
      h.host_name.toLowerCase().includes(sourceName.toLowerCase().split(" ")[0])
    )?.url ?? null;

  // Persist as a live report
  const marketId = await getDefaultMarketId();
  await db.priceReport.create({
    data: {
      itemId: item.id,
      marketId,
      price,
      reporterName: `Live: ${sourceName}`,
      sourceName,
      sourceUrl,
      reportedAt: new Date(),
    },
  });

  return { price, sourceName, sourceUrl };
}
