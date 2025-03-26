"use server";

import { lazy, Suspense } from "react";

const LazyListDetail = lazy(() => import("./listDetail"));

interface PageProps {
  params: Promise<{ id: string }>; // params is a promise
}
const List = async ({ params }: PageProps) => {
  const { id } = await params;
  return (
    <Suspense fallback={<div>Loading List Details...</div>}>
      <LazyListDetail id={id} />
    </Suspense>
  );
};

export default List;
