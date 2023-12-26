import Image from "next/image";
import { type TableRow } from "./Table";
import { getItemDescription } from "@/utils/getItemDescription";
import { getItemName } from "@/utils/getItemName";
import { Fragment, useCallback } from "react";
import { differenceInMinutes } from "date-fns";
import { getItemTier } from "@/utils/getItemTier";

interface RowProps {
  data: TableRow;
}

export function Row({ data }: RowProps) {
  return (
    <tr>
      <td>
        <div className="flex content-center">
          <Image
            alt={`${getItemName(data.itemUniqueName)}: ${getItemDescription(
              data.itemUniqueName,
            )}`}
            src={`https://render.albiononline.com/v1/item/${data.itemUniqueName}.png`}
            width={32}
            height={32}
          />
          {getItemName(data.itemUniqueName)}&nbsp;
          <span className="text-gray-500">
            {getItemTier(data.itemUniqueName)}
          </span>
        </div>
      </td>
      <DataCells data={data} />
    </tr>
  );
}

function DataCells({ data }: RowProps) {
  const getRouteLabel = useCallback(
    (
      from: Exclude<TableRow["buy"], undefined>,
      to: Exclude<TableRow["buy"], undefined>,
      travelTime: number,
    ) => {
      if (from.city === to.city) {
        return <CityLabel data={from} />;
      }

      return (
        <Fragment>
          <CityLabel data={from} /> -({travelTime}m)-{">"}{" "}
          <CityLabel data={to} />
        </Fragment>
      );
    },
    [],
  );

  if (!data.buy?.price || !data.sell?.price) {
    return (
      <>
        <td colSpan={4}>No data</td>
      </>
    );
  }

  return (
    <Fragment>
      <td>{getRouteLabel(data.buy, data.sell, data.travelTime)}</td>
      <td>{data.buy.price.toLocaleString()}</td>
      <td>{data.sell.price.toLocaleString()}</td>
      <td>{data.spread.toLocaleString()}</td>
      <td>
        {data.profitPerHour
          ? Math.floor(data.profitPerHour).toLocaleString()
          : "—"}
      </td>
      <td>{data.roi.toFixed(2)}%</td>
    </Fragment>
  );
}

function CityLabel({ data }: { data: Exclude<TableRow["buy"], undefined> }) {
  const staleness = differenceInMinutes(new Date(), new Date(data.age));

  return (
    <span
      className={`${
        staleness > 90
          ? "text-red-500"
          : staleness > 45
            ? "text-yellow-500"
            : undefined
      }`}
    >
      {data.city}
    </span>
  );
}
