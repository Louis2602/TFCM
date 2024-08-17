"use server";
import { env } from "@/env";
import fs from "fs";
import path from "path";

interface RowData {
  id: number;
  title: string;
  used: number;
  category: string;
  checked: boolean;
}

export default async function getTrendingsByFile(
  isTag: boolean
): Promise<RowData[]> {
  try {
    let i = 0;
    const fileName = isTag ? "trending-tags.txt" : "trending-keywords.txt";
    const filePath = path.join(process.cwd(), "public", "file", fileName);
    const text = fs.readFileSync(filePath, "utf-8");

    return text.split("\n").map((line) => {
      const [title, used, category] = line.split("/");
      return {
        id: ++i,
        title,
        used: parseInt(used, 10),
        category,
        checked: false,
      };
    });
  } catch (error) {
    console.error("Error fetching the file:", error);
    return [];
  }
}
