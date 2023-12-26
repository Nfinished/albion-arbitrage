"use client";

import { type ItemUniqueName } from "@/constants/items";
import { type RawMarketData, type MarketData } from "@/data/getMarketData";
// import useQueryParam from "@/hooks/useQueryParam";
import { getTravelTime } from "@/utils/getTravelTime";
import { useMemo } from "react";
import { Row } from "./Row";

interface TableProps {
  marketData: MarketData;
}

export function Table({ marketData }: TableProps) {
  // const [cities, setCities] = useQueryParam<number>("city", 1);

  const tableData = useMemo(() => {
    return Array.from(marketData.entries())
      .map((entry) => {
        return getTradeInfo(...entry);
      })
      .sort((a, b) => (a.spread && b.spread ? b.roi - a.roi : 0));
  }, [marketData]);

  return (
    <table className="table-auto">
      <thead>
        <tr>
          <th>Item name</th>
          <th>Route</th>
          <th>Buy for</th>
          <th>Sell for</th>
          <th>Profit</th>
          <th>Profit / hr</th>
          <th>ROI</th>
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

function getTradeInfo(itemUniqueName: ItemUniqueName, data: RawMarketData[]) {
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
    false,
  );

  const finalSellPrice = Math.floor(
    highestBuyPrice.buy_price_max * (1 - 0.04 - 0.025),
  );
  const profit = finalSellPrice - lowestSellPrice.sell_price_min;

  return {
    itemUniqueName: itemUniqueName,
    travelTime,
    spread: highestBuyPrice.buy_price_max - lowestSellPrice.sell_price_min,
    profitPerHour: travelTime
      ? Math.floor((profit / travelTime) * 60).toLocaleString()
      : "—",
    roi: (finalSellPrice / lowestSellPrice.sell_price_min - 1) * 100,
    buy: {
      city: lowestSellPrice.city,
      price: lowestSellPrice.sell_price_min,
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
