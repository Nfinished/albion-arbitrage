"use client";

import { type ItemUniqueName } from "@/constants/items";
import { type RawMarketData, type MarketData } from "@/data/getMarketData";
import { getTravelTime } from "@/utils/getTravelTime";
import { useCallback, useMemo, useState, useTransition } from "react";
import { Row } from "./Row";
import { type City, cities, cityColors } from "@/constants/cities";
import { toggleSetImmutable } from "@/utils/set";

interface TableProps {
  marketData: MarketData;
}

export function Table({ marketData }: TableProps) {
  const [_, startTransition] = useTransition();
  const [preferSafer, setPreferSafer] = useState(true);
  const [premiumAccount, setPremiumAccount] = useState(true);

  const [selectedCities, setSelectedCities] = useState<Set<City>>(
    new Set(cities),
  );

  const handleUpdateSelectedCities = useCallback((city: City) => {
    startTransition(() => {
      setSelectedCities((prev) => {
        return toggleSetImmutable(prev, city);
      });
    });
  }, []);

  const tableData = useMemo(() => {
    return Array.from(marketData.entries())
      .map((entry) => {
        return getTradeInfo(...entry, {
          preferSafer,
          premiumAccount,
          cities: selectedCities,
        });
      })
      .sort((a, b) => {
        const nameCompare = a.itemUniqueName.localeCompare(b.itemUniqueName);
        const aSpreadExists = a.spread !== undefined;
        const bSpreadExists = b.spread !== undefined;

        if (aSpreadExists && !bSpreadExists) {
          return -1;
        }
        if (!aSpreadExists && bSpreadExists) {
          return 1;
        }
        if (!aSpreadExists && !bSpreadExists) {
          return 0;
        }

        if (a.spread && b.spread) {
          return b.roi - a.roi || nameCompare;
        }

        return nameCompare;
      });
  }, [marketData, preferSafer, premiumAccount, selectedCities]);

  return (
    <table className="table-auto w-full min-w-[1031px]">
      <thead className="sticky top-0 bg-black">
        <tr>
          <th className="text-left">Item name</th>
          <th colSpan={3}>
            <div className="mb-1">
              Route{" "}
              <label className="text-xs flex-inline justify-center">
                (
                <input
                  className="w-3 h-3 align-text-bottom"
                  type="checkbox"
                  checked={preferSafer}
                  onChange={(e) =>
                    startTransition(() => setPreferSafer(e.target.checked))
                  }
                />{" "}
                prefer safer)
              </label>
            </div>
            <div className="flex gap-1 justify-around mb-2">
              {Array.from(cities).map((city) => (
                <label
                  key={city}
                  style={
                    selectedCities.has(city)
                      ? {
                          color: cityColors[city],
                          borderColor: cityColors[city],
                        }
                      : { opacity: 0.5 }
                  }
                  className={
                    "text-xs border-2 px-1 py-0.5 rounded flex items-center gap-0.5 select-none cursor-pointer"
                  }
                >
                  <input
                    type="checkbox"
                    checked={selectedCities.has(city)}
                    className="appearance-none"
                    onChange={() => handleUpdateSelectedCities(city)}
                  />
                  {city.slice(0, 4)}
                </label>
              ))}
            </div>
          </th>
          <th className="text-right">Buy</th>
          <th className="text-right">
            Sell{" "}
            <label className="text-xs flex-inline justify-center">
              (
              <input
                className="w-3 h-3 align-text-bottom"
                type="checkbox"
                checked={premiumAccount}
                onChange={(e) =>
                  startTransition(() => setPremiumAccount(e.target.checked))
                }
              />{" "}
              premium)
            </label>
          </th>
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

interface TradeInfoOptions {
  preferSafer: boolean;
  premiumAccount: boolean;
  cities: Set<City>;
}

function getTradeInfo(
  itemUniqueName: ItemUniqueName,
  data: RawMarketData[],
  { preferSafer, premiumAccount, cities }: TradeInfoOptions,
) {
  const lowestSellPrice = data
    .filter((p) => p.sell_price_min && cities.has(p.city))
    .sort((a, b) => a.sell_price_min - b.sell_price_min)[0];
  const highestBuyPrice = data
    .filter((p) => p.buy_price_max && cities.has(p.city))
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

  const finalSellPrice = Math.ceil(
    marketBuyPrice * (1 - 0.025 - (Number(!premiumAccount) + 1) * 0.04),
  );

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
