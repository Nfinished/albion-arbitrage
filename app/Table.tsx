"use client";

import { type ItemUniqueName } from "@/constants/items";
import { type RawMarketData, type MarketData } from "@/data/getMarketData";
// import useQueryParam from "@/hooks/useQueryParam";
import { getTravelTime } from "@/utils/getTravelTime";
import { useMemo, useState } from "react";
import { Row } from "./Row";

interface TableProps {
  marketData: MarketData;
}

export function Table({ marketData }: TableProps) {
  const [preferSafer, setPreferSafer] = useState(true);

  const tableData = useMemo(() => {
    return Array.from(marketData.entries())
      .map((entry) => {
        return getTradeInfo(...entry, preferSafer);
      })
      .sort((a, b) =>
        a.spread && b.spread ? b.profitPerHour - a.profitPerHour : 0,
      );
  }, [marketData, preferSafer]);

  return (
    <table className="table-auto w-full min-w-[1031px]">
      <thead className="sticky top-0 bg-black">
        <tr>
          <th className="text-left">Item name</th>
          <th colSpan={3}>
            Route{" "}
            <label className="text-xs flex-inline content-center justify-center">
              (
              <input
                className="w-3 h-3 align-text-bottom"
                type="checkbox"
                checked={preferSafer}
                onChange={(e) => setPreferSafer(e.target.checked)}
              />{" "}
              prefer safer)
            </label>
          </th>
          <th className="text-right">Buy</th>
          <th className="text-right">Sell</th>
          <th className="text-right">Spread</th>
          <th className="text-right">$/hr</th>
          <th className="text-right">ROI</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((item) => (
          <Row key={item.itemUniqueName} data={item} />
        ))}
      </tbody>
    </table>
  );
}

function getTradeInfo(
  itemUniqueName: ItemUniqueName,
  data: RawMarketData[],
  preferSafer: boolean,
) {
  const lowestSellPrice = data
    .filter((p) => p.sell_price_min)
    .sort((a, b) => a.sell_price_min - b.sell_price_min)[0];
  const highestBuyPrice = data
    .filter((p) => p.buy_price_max)
    .sort((a, b) => b.buy_price_max - a.buy_price_max)[0];

  if (!lowestSellPrice || !highestBuyPrice) {
    return {
      itemUniqueName,
    };
  }

  const travelTime = getTravelTime(
    lowestSellPrice.city,
    highestBuyPrice.city,
    preferSafer,
  );

  const marketBuyPrice = Math.ceil(highestBuyPrice.buy_price_max);
  const marketSellPrice = Math.floor(lowestSellPrice.sell_price_min);

  const finalSellPrice = Math.ceil(marketBuyPrice * (1 - 0.04 - 0.025));

  const spread = finalSellPrice - marketSellPrice;

  return {
    itemUniqueName: itemUniqueName,
    travelTime,
    spread: highestBuyPrice.buy_price_max - marketSellPrice,
    profitPerHour: travelTime ? (spread / travelTime) * 60 : 0,
    roi: (finalSellPrice / marketSellPrice - 1) * 100,
    buy: {
      city: lowestSellPrice.city,
      price: marketSellPrice,
      age: lowestSellPrice.sell_price_min_date,
    },
    sell: {
      city: highestBuyPrice.city,
      price: finalSellPrice,
      age: highestBuyPrice.buy_price_max_date,
    },
  };
}

export type TableRow = ReturnType<typeof getTradeInfo>;
