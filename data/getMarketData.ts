import { type City } from "@/constants/cities";
import { items, type ItemUniqueName } from "@/constants/items";

export interface RawMarketData {
  item_id: ItemUniqueName;
  city: City;
  quality: number;
  sell_price_min: number;
  sell_price_min_date: string;
  sell_price_max: number;
  sell_price_max_date: string;
  buy_price_min: number;
  buy_price_min_date: string;
  buy_price_max: number;
  buy_price_max_date: string;
}

export type MarketData = Map<ItemUniqueName, RawMarketData[]>;

export async function getMarketData() {
  const itemList = Array.from(items);

  // Filter out enchanted rocks and blocks because they're trash
  const filteredItemList = itemList.filter(
    (item) => !/(_ROCK_|_BLOCK_)/.test(item),
  );

  // albion data project API has a 4096 character limit on the URL
  // so we need to split the request up into chunks
  const chunks = chunkArray(filteredItemList, 2000);

  const data = await Promise.all(chunks.map(getMarketDataImpl));

  return new Map(...data.flat());
}

async function getMarketDataImpl(itemList: ItemUniqueName[]) {
  const response = await fetch(makeUrl(itemList), {
    next: { revalidate: 15 },
  });

  const data: RawMarketData[] = await response.json();

  const marketDataByItem = data.reduce<MarketData>((acc, item) => {
    const current = acc.get(item.item_id) || [];

    acc.set(item.item_id, [
      ...current,
      {
        ...item,
        sell_price_max_date: item.sell_price_max_date + "Z",
        sell_price_min_date: item.sell_price_min_date + "Z",
        buy_price_max_date: item.buy_price_max_date + "Z",
        buy_price_min_date: item.buy_price_min_date + "Z",
      },
    ]);

    return acc;
  }, new Map());

  return marketDataByItem;
}

function makeUrl(itemList: string[]) {
  return `https://west.albion-online-data.com/api/v2/stats/Prices/${encodeURIComponent(
    itemList.join(","),
  )}.json?locations=Caerleon,Bridgewatch,Thetford,Lymhurst,FortSterling,Martlock`;
}

function chunkArray<T>(array: T[], chunkSize: number) {
  const chunks = [] as T[][];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
