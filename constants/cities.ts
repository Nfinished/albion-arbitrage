export type City =
  | "Caerleon"
  | "Bridgewatch"
  | "Thetford"
  | "Lymhurst"
  | "Fort Sterling"
  | "Martlock";

export const cities = new Set<City>([
  "Bridgewatch",
  "Caerleon",
  "Fort Sterling",
  "Lymhurst",
  "Martlock",
  "Thetford",
]);

export const cityColors: Record<City, string> = {
  Caerleon: "rgb(218, 56, 50)",
  Bridgewatch: "rgb(253, 242, 81)",
  Thetford: "rgb(152, 78, 160)",
  Lymhurst: "rgb(191, 229, 78)",
  "Fort Sterling": "rgb(255, 255, 255)",
  Martlock: "rgb(65, 72, 197)",
};
