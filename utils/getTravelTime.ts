import { type City } from "@/constants/cities";
import { TRAVEL_DISTSANCE, ZONE_TRANSIT_TIME } from "@/constants/travel";

export function getTravelTime(
  from: City,
  to: City,
  preferSafer: boolean,
): number {
  return (
    ZONE_TRANSIT_TIME *
    TRAVEL_DISTSANCE[from][preferSafer ? "safe" : "unsafe"][to]
  );
}
