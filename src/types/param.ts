import type { Metadata, ResolvingMetadata } from "next";
export type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};
