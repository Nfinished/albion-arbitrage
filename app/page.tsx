import { getMarketData } from "@/data/getMarketData";
import { Table } from "./Table";
import { Fragment } from "react";

export default async function Home() {
  const marketData = await getMarketData();

  return (
    <Fragment>
      Buy from sell orders, sell to buy orders. Tax is included in the sale
      price.
      <Table marketData={marketData} />
    </Fragment>
  );
}
