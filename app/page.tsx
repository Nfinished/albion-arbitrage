import { getMarketData } from "@/data/getMarketData";
import { Suspense } from "react";
import { Table } from "./Table";

export default async function Home() {
  const marketData = await getMarketData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Table marketData={marketData} />
    </Suspense>
  );
}
