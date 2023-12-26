import { type ItemUniqueName, itemMetadata } from "@/constants/items";

export function getItemDescription(itemUniqueName: ItemUniqueName) {
  const item = itemMetadata.get(itemUniqueName);

  if (!item) {
    throw new Error(`No item found with unique name ${itemUniqueName}`);
  }

  return item.description;
}
