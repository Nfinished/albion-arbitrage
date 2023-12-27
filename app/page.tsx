import { getMarketData } from "@/data/getMarketData";
import { Table } from "./Table";
import { Fragment } from "react";

export default async function Home() {
  const marketData = await getMarketData();

  return (
    <Fragment>
      <div className="mb-4 w-full">
        Buy from sell orders, sell to buy orders. Tax is included in the sale
        price.
        <br />
        <span className="text-yellow-500">Yellow</span> and{" "}
        <span className="text-red-500">Red</span> cities indicate stale data.
        <div className="hidden md:block mt-1">
          Prices out of date? Help us out by contributing to the{" "}
          <a
            className="text-blue-600 dark:text-blue-500 hover:underline"
            href="https://www.albion-online-data.com/"
            target="_blank"
            rel="noopener"
          >
            Albion Data Project
          </a>
          . It&apos;s fast and free!
        </div>
      </div>
      <Table marketData={marketData} />
    </Fragment>
  );
}
