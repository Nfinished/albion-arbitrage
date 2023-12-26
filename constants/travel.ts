import { type City } from "./cities";

interface TravelData {
  safe: Record<City, number>;
  unsafe: Record<City, number>;
}

export const ZONE_TRANSIT_TIME = 3;

export const TRAVEL_DISTSANCE: Record<City, TravelData> = {
  Martlock: {
    safe: {
      Martlock: 0,
      Thetford: 7,
      "Fort Sterling": 12,
      Lymhurst: 11,
      Bridgewatch: 7,
      Caerleon: 7,
    },
    unsafe: {
      Martlock: 0,
      Thetford: 7,
      "Fort Sterling": 10,
      Lymhurst: 11,
      Bridgewatch: 7,
      Caerleon: 7,
    },
  },
  Thetford: {
    safe: {
      Martlock: 7,
      Thetford: 0,
      "Fort Sterling": 7,
      Lymhurst: 12,
      Bridgewatch: 14,
      Caerleon: 7,
    },
    unsafe: {
      Martlock: 7,
      Thetford: 0,
      "Fort Sterling": 7,
      Lymhurst: 11,
      Bridgewatch: 12,
      Caerleon: 7,
    },
  },
  "Fort Sterling": {
    safe: {
      Martlock: 12,
      Thetford: 7,
      "Fort Sterling": 0,
      Lymhurst: 7,
      Bridgewatch: 14,
      Caerleon: 10,
    },
    unsafe: {
      Martlock: 10,
      Thetford: 7,
      "Fort Sterling": 0,
      Lymhurst: 7,
      Bridgewatch: 12,
      Caerleon: 10,
    },
  },
  Lymhurst: {
    safe: {
      Martlock: 11,
      Thetford: 12,
      "Fort Sterling": 7,
      Lymhurst: 0,
      Bridgewatch: 7,
      Caerleon: 7,
    },
    unsafe: {
      Martlock: 11,
      Thetford: 11,
      "Fort Sterling": 7,
      Lymhurst: 0,
      Bridgewatch: 7,
      Caerleon: 7,
    },
  },
  Bridgewatch: {
    safe: {
      Martlock: 7,
      Thetford: 14,
      "Fort Sterling": 14,
      Lymhurst: 7,
      Bridgewatch: 0,
      Caerleon: 7,
    },
    unsafe: {
      Martlock: 7,
      Thetford: 12,
      "Fort Sterling": 12,
      Lymhurst: 7,
      Bridgewatch: 0,
      Caerleon: 7,
    },
  },
  Caerleon: {
    safe: {
      Martlock: 7,
      Thetford: 7,
      "Fort Sterling": 10,
      Lymhurst: 7,
      Bridgewatch: 7,
      Caerleon: 0,
    },
    unsafe: {
      Martlock: 7,
      Thetford: 7,
      "Fort Sterling": 10,
      Lymhurst: 7,
      Bridgewatch: 7,
      Caerleon: 0,
    },
  },
};
