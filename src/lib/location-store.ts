"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DetectedLocation = {
  district: string;
  districtBn: string;
  upazila?: string;
  marketId: string;
  marketNameBn: string;
  marketNameEn: string;
  latitude?: number;
  longitude?: number;
  isAutoDetected: boolean;
};

type LocationState = {
  location: DetectedLocation | null;
  isLoading: boolean;
  error: string | null;
  setLocation: (loc: DetectedLocation) => void;
  clearLocation: () => void;
  detectLocation: () => Promise<void>;
};

// Known coordinates for 11 markets for distance calculation
const MARKET_COORDINATES: Array<{
  id: string;
  nameBn: string;
  nameEn: string;
  district: string;
  districtBn: string;
  upazila: string;
  lat: number;
  lng: number;
}> = [
  { id: "cmv4vsgdy001iltbfl2l4g0ui", nameBn: "কারওয়ান বাজার", nameEn: "Karwan Bazar", district: "Dhaka", districtBn: "ঢাকা", upazila: "Dhaka South", lat: 23.7516, lng: 90.3934 },
  { id: "cmv4vsgdy001jltbf4z6pham5", nameBn: "মিরপুর ১ নং বাজার", nameEn: "Mirpur Bazar", district: "Dhaka", districtBn: "ঢাকা", upazila: "Mirpur", lat: 23.7956, lng: 90.3537 },
  { id: "cmv4vsgdz001mltbfclb0hzuw", nameBn: "মোহাম্মদপুর বাজার", nameEn: "Mohammadpur Bazar", district: "Dhaka", districtBn: "ঢাকা", upazila: "Mohammadpur", lat: 23.7658, lng: 90.3585 },
  { id: "cmv4vsgdz001oltbfwysly3xr", nameBn: "গুলশান বাজার", nameEn: "Gulshan Bazar", district: "Dhaka", districtBn: "ঢাকা", upazila: "Gulshan", lat: 23.7925, lng: 90.4078 },
  { id: "cmv4vsge0001qltbfy5pvqs3q", nameBn: "জয়দেবপুর বাজার", nameEn: "Jaydevpur Bazar", district: "Gazipur", districtBn: "গাজীপুর", upazila: "Gazipur Sadar", lat: 23.9999, lng: 90.4203 },
  { id: "cmv4vsge1001rltbfmdyy1fft", nameBn: "চট্টগ্রাম কদম মোবারক বাজার", nameEn: "Chattogram Kadam Mubarak", district: "Chattogram", districtBn: "চট্টগ্রাম", upazila: "Chattogram Sadar", lat: 22.3475, lng: 91.8324 },
  { id: "cmv4vsge1001sltbfvozqhmb3", nameBn: "কুমিল্লা নতুন বাজার", nameEn: "Comilla New Market", district: "Cumilla", districtBn: "কুমিল্লা", upazila: "Cumilla Sadar", lat: 23.4607, lng: 91.1809 },
  { id: "cmv4vsgdy001kltbf7x5yvcax", nameBn: "সিলেট জিন্দাবাজার", nameEn: "Sylhet Zindabazar", district: "Sylhet", districtBn: "সিলেট", upazila: "Sylhet Sadar", lat: 24.8949, lng: 91.8687 },
  { id: "cmv4vsgdz001lltbfmb8vbshi", nameBn: "রাজশাহী সাহেব বাজার", nameEn: "Rajshahi Saheb Bazar", district: "Rajshahi", districtBn: "রাজশাহী", upazila: "Rajshahi Sadar", lat: 24.3636, lng: 88.6014 },
  { id: "cmv4vsge0001pltbfkwvogwkc", nameBn: "খুলনা নিউ মার্কেট", nameEn: "Khulna New Market", district: "Khulna", districtBn: "খুলনা", upazila: "Khulna Sadar", lat: 22.8228, lng: 89.5539 },
  { id: "cmv4vsgdz001nltbf9pp47wz1", nameBn: "বরিশাল বাজার", nameEn: "Barishal Bazar", district: "Barishal", districtBn: "বরিশাল", upazila: "Barishal Sadar", lat: 22.7010, lng: 90.3535 },
];

function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      location: null,
      isLoading: false,
      error: null,
      setLocation: (location) => set({ location, error: null }),
      clearLocation: () => set({ location: null, error: null }),
      detectLocation: async () => {
        set({ isLoading: true, error: null });

        if (typeof window === "undefined" || !navigator.geolocation) {
          // Fallback to IP or Default Dhaka
          const defaultM = MARKET_COORDINATES[0];
          set({
            location: {
              district: defaultM.district,
              districtBn: defaultM.districtBn,
              upazila: defaultM.upazila,
              marketId: defaultM.id,
              marketNameBn: defaultM.nameBn,
              marketNameEn: defaultM.nameEn,
              isAutoDetected: false,
            },
            isLoading: false,
          });
          return;
        }

        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: true,
            });
          });

          const { latitude, longitude } = pos.coords;

          // Find closest market by distance
          let closest = MARKET_COORDINATES[0];
          let minDistance = Infinity;

          for (const m of MARKET_COORDINATES) {
            const dist = getDistanceKm(latitude, longitude, m.lat, m.lng);
            if (dist < minDistance) {
              minDistance = dist;
              closest = m;
            }
          }

          set({
            location: {
              district: closest.district,
              districtBn: closest.districtBn,
              upazila: closest.upazila,
              marketId: closest.id,
              marketNameBn: closest.nameBn,
              marketNameEn: closest.nameEn,
              latitude,
              longitude,
              isAutoDetected: true,
            },
            isLoading: false,
            error: null,
          });
        } catch (err: any) {
          // If denied or timed out, gracefully assign Karwan Bazar, Dhaka as default recommended
          const defaultM = MARKET_COORDINATES[0];
          set({
            location: {
              district: defaultM.district,
              districtBn: defaultM.districtBn,
              upazila: defaultM.upazila,
              marketId: defaultM.id,
              marketNameBn: defaultM.nameBn,
              marketNameEn: defaultM.nameEn,
              isAutoDetected: false,
            },
            isLoading: false,
            error: err.message || "Location access denied",
          });
        }
      },
    }),
    { name: "bazar-user-location" }
  )
);

export { MARKET_COORDINATES };
