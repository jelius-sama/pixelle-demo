// infinite-scroll.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import getMockData from "./mock-data";

type Items = {
  id: number;
  title: string;
  description: string;
};

const STORAGE_KEY = "infinite-scroll-data";

type StoredData = {
  items: Items[];
  page: number;
  hasMore: boolean;
};

export default function InfiniteScrollList({
  initialItems,
}: {
  initialItems: Items[];
}) {
  const [items, setItems] = useState<Items[]>([]);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const initialized = useRef(false);

  // Load stored data on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      const storedData = sessionStorage.getItem(STORAGE_KEY);
      if (storedData) {
        const data: StoredData = JSON.parse(storedData);
        setItems(data.items);
        setPage(data.page);
        setHasMore(data.hasMore);
      } else {
        setItems(initialItems);
      }
    } catch (error) {
      console.error("Error loading stored data:", error);
      setItems(initialItems);
    }
  }, [initialItems]);

  // Save data to sessionStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      const dataToStore: StoredData = {
        items,
        page,
        hasMore,
      };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
      } catch (error) {
        console.error("Error saving to session storage:", error);
      }
    }
  }, [items, page, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore]);

  const loadMore = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const data = await getMockData(page);

      if (data.items.length === 0) {
        setHasMore(false);
      } else {
        setItems((prev) => [...prev, ...data.items]);
        setPage((prev) => prev + 1);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Function to clear stored data
  const resetData = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setItems(initialItems);
    setPage(2);
    setHasMore(true);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{item.description}</p>
          </CardContent>
        </Card>
      ))}

      {hasMore && (
        <div ref={loaderRef} className="flex justify-center p-4">
          {loading ? (
            <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin" />
          ) : (
            <div className="h-4" />
          )}
        </div>
      )}

      {!hasMore && (
        <div className="text-center p-4 text-gray-500">
          No more items to load
        </div>
      )}
    </div>
  );
}
