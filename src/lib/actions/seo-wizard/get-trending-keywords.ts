"use server";
import axios from "axios";
import { env } from "@/env";
import { trending } from "@/db/schema";

interface DailyData {
  query: string;
  traffic: number;
}

interface RowData {
  id: number;
  title: string;
  used: number;
  category: string;
  checked: boolean;
}

const getCategoryName = (category: string): string =>
  ({
    b: "Business",
    e: "Entertainment",
    m: "Health",
    t: "Sci/Tech",
    s: "Sports",
    h: "Top stories",
  }[category] || "Trending");

const removeDuplicatesByTitle = (keywords: RowData[]): RowData[] => {
  const seenTitles = new Set<string>();
  return keywords.filter(({ title }) => {
    if (seenTitles.has(title)) return false;
    seenTitles.add(title);
    return true;
  });
};

export default async function getTrendingKeywords(): Promise<RowData[]> {
  const categories = ["b", "e", "m", "t", "s", "h"];
  const keywords: RowData[] = [];
  let i = 0;

  for (const category of categories) {
    try {
      const response = await axios.get(
        `${env.GOOGLE_TRENDS_REALTIME_URL}?engine=google_trends_trending_now&frequency=realtime&geo=US&cat=${category}&api_key=${env.GOOGLE_TRENDS_API_KEY}`
      );
      const trendings = response.data.realtime_searches;

      trendings.forEach(({ queries }: any) => {
        keywords.push({
          id: ++i,
          title: queries[0],
          used: Math.floor(Math.random() * (2000000 - 100000 + 1)) + 100000,
          category: getCategoryName(category),
          checked: false,
        });
      });
    } catch (error) {
      console.error(`Error fetching data for category ${category}:`, error);
    }
  }

  return removeDuplicatesByTitle(keywords);
}
