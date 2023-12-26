import fs from "node:fs";

interface I18N {
  "EN-US": string;
}
interface Item {
  LocalizationNameVariable: string;
  LocalizationDescriptionVariable: string;
  LocalizedNames: I18N;

  LocalizedDescriptions: I18N;
  Index: `${number}`;
  UniqueName: ItemUniqueName;
}

import { Item as ResolvedItem, ItemUniqueName } from "../constants/items";

type ResourceType = "HIDE" | "WOOD" | "ORE" | "ROCK" | "FIBER";
type MaterialType = "LEATHER" | "PLANKS" | "METALBAR" | "STONEBLOCK" | "CLOTH";
type ArtifactType = "RUNE" | "SOUL" | "RELIC" | "SHARD_AVALONIAN";
type CropType =
  | "CARROT"
  | "BEAN"
  | "WHEAT"
  | "TURNIP"
  | "CABBAGE"
  | "POTATO"
  | "CORN"
  | "PUMPKIN";
type MeatType = "MEAT";

type ByproductType = "EGG" | "MILK" | "BUTTER";

enum Resource {
  HIDE = "HIDE",
  WOOD = "WOOD",
  ORE = "ORE",
  ROCK = "ROCK",
  FIBER = "FIBER",
}

enum Material {
  LEATHER = "LEATHER",
  PLANKS = "PLANKS",
  METALBAR = "METALBAR",
  STONEBLOCK = "STONEBLOCK",
  CLOTH = "CLOTH",
}

enum Artifact {
  RUNE = "RUNE",
  SOUL = "SOUL",
  RELIC = "RELIC",
  SHARD_AVALONIAN = "SHARD_AVALONIAN",
}

enum Crop {
  CARROT = "CARROT",
  BEAN = "BEAN",
  WHEAT = "WHEAT",
  TURNIP = "TURNIP",
  CABBAGE = "CABBAGE",
  POTATO = "POTATO",
  CORN = "CORN",
  PUMPKIN = "PUMPKIN",
}

enum Meat {
  MEAT = "MEAT",
}

enum ByProduct {
  EGG = "EGG",
  MILK = "MILK",
  BUTTER = "BUTTER",
}

type ResourceUniqueName = `T${number}_${ResourceType}${
  | ""
  | `_LEVEL${number}@${number}`}`;
type MaterialUniqueName = `T${number}_${MaterialType}${
  | ""
  | `_LEVEL${number}@${number}`}`;
type ArtifactUniqueName = `T${number}_${ArtifactType}`;
type CropUniqueName = `T${number}_${CropType}`;
type MeatUniqueName = `T${number}_${MeatType}`;
type ByProductUniqueName = `T${number}_${ByproductType}`;

const tierMatcher = "(?:_LEVEL(\\d+)@(\\d+))?";

const resourceUniqueNameMatcher = `T(\\d+)_(${Object.keys(Resource).join(
  "|",
)})${tierMatcher}`;
const materialUniqueNameMatcher = `T(\\d+)_(${Object.keys(Material).join(
  "|",
)})${tierMatcher}`;
const artifactUniqueNameMatcher = `T(\\d+)_(${Object.keys(Artifact).join(
  "|",
)})`;
const cropUniqueNameMatcher = `T(\\d+)_(${Object.keys(Crop).join("|")})`;
const meatUniqueNameMatcher = `T(\\d+)_(${Object.keys(Meat).join("|")})`;
const byproductUniqueNameMatcher = `T(\\d+)_(${Object.keys(ByProduct).join(
  "|",
)})`;

const bulkItemUniqueNameMatcher = new RegExp(
  `(${resourceUniqueNameMatcher}|${materialUniqueNameMatcher}|${artifactUniqueNameMatcher}|${cropUniqueNameMatcher})|${meatUniqueNameMatcher}|${byproductUniqueNameMatcher}`,
);

const response: Item[] = await fetch(
  "https://raw.githubusercontent.com/ao-data/ao-bin-dumps/master/formatted/items.json",
).then((res) => res.json());

const bulkItems = response.filter((item) =>
  bulkItemUniqueNameMatcher.test(item.UniqueName),
);

const uniqueNames = bulkItems.map((item) => item.UniqueName);
const localizedItemNameMap = bulkItems.reduce(
  (acc, item) => {
    acc.push([
      item.UniqueName,
      {
        name: item.LocalizedNames["EN-US"],
        uniqueName: item.UniqueName,
        description: item.LocalizedDescriptions["EN-US"],
        id: Number(item.Index),
      },
    ]);
    return acc;
  },
  [] as [string, ResolvedItem][],
);

const items = `
// @@@ GENERATED FILE @@@ //
export type ItemUniqueName = ${uniqueNames
  .map((name) => `'${name}'`)
  .join(" | ")}
export interface Item {
  name: string;
  uniqueName: ItemUniqueName;
  description: string;
  id: number;
}
export const items = new Set<ItemUniqueName>([${uniqueNames
  .map((uniqueName) => `'${uniqueName}'`)
  .join(",")}])
export const itemMetadata: Map<ItemUniqueName, Item> = new Map(${JSON.stringify(
  localizedItemNameMap,
)})
`;

fs.writeFileSync("./constants/items.ts", items);
