import Image from "next/image";
import { type TableRow } from "./Table";
import { getItemDescription } from "@/utils/getItemDescription";
import { getItemName } from "@/utils/getItemName";
import { Fragment, useCallback } from "react";
import { differenceInMinutes, formatDistanceToNowStrict } from "date-fns";
import { getItemTier } from "@/utils/getItemTier";
import { clsx } from "clsx/lite";
interface RowProps {
  data: TableRow;
}

export function Row({ data }: RowProps) {
  return (
    <tr className="hover:bg-gray-900">
      <td>
        <div className="flex items-center">
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
        return (
          <td colSpan={3} className="text-center">
            <CityLabel data={from} />
          </td>
        );
      }

      return (
        <Fragment>
          <td className="text-right">
            <CityLabel data={from} />
          </td>
          <td className="text-center">
            —({travelTime}m)—{">"}
          </td>
          <td>
            <CityLabel data={to} />
          </td>
        </Fragment>
      );
    },
    [],
  );

  if (!data.buy?.price || !data.sell?.price) {
    return <td colSpan={9} />;
  }

  return (
    <Fragment>
      {getRouteLabel(data.buy, data.sell, data.travelTime)}
      <td className="text-right">{data.buy.price.toLocaleString()}</td>
      <td className="text-right">{data.sell.price.toLocaleString()}</td>
      <td className="text-right">{data.spread.toLocaleString()}</td>
      <td className="text-right">
        {data.profitPerHour
          ? Math.floor(data.profitPerHour).toLocaleString()
          : "—"}
      </td>
      <td className="text-right">{data.roi.toFixed(2)}%</td>
    </Fragment>
  );
}

function CityLabel({ data }: { data: Exclude<TableRow["buy"], undefined> }) {
  const staleness = differenceInMinutes(new Date(), new Date(data.age));

  const title = `${formatDistanceToNowStrict(new Date(data.age))} ago`;

  return (
    <span
      title={title}
      className={clsx(
        staleness >= 90 && "text-red-500",
        staleness >= 30 && staleness < 90 && "text-yellow-500",
      )}
    >
      {data.city}
    </span>
  );
}
