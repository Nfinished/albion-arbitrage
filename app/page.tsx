import { getMarketData } from "@/data/getMarketData";
import { Suspense } from "react";
import { Table } from "./Table";

export default async function Home() {
  const marketData = await getMarketData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      Buy from sell orders, sell to buy orders. Tax is considered, but not
      volume.
      <Table marketData={marketData} />
    </Suspense>
  );
}
