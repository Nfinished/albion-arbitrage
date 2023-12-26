import { type ItemUniqueName } from "@/constants/items";

export function getItemTier(itemUniqueName: ItemUniqueName) {
  let tier = itemUniqueName.slice(0, 2);
  let quality = itemUniqueName.split("").splice(-1)[0];

  return `${tier}${isNaN(parseInt(quality)) ? "" : `.${quality}`}`;
}
