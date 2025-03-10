import MarginedContent from "@/components/ui/margined-content";
import InfiniteScrollList from "./infinite-scroll";
import PageTitle from "@/components/layout/page-title";
import { Metadata } from "next";
import Link from "next/link";
import { title } from "@/components/primitives";

export const metadata: Metadata = {
  title: "Test page",
};

async function getInitialItems() {
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}`,
  }));

  return items;
}

export default async function Test() {
  const initialItems = await getInitialItems();

  return (
    <MarginedContent>
      <PageTitle className={title({ color: "foreground" })}>
        Infinite Scroll Demo
      </PageTitle>
      <InfiniteScrollList initialItems={initialItems} />
      <Link href={"/test/inside-test"}>Go to next page</Link>
    </MarginedContent>
  );
}
