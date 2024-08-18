"use server";
import axios from "axios";
import { env } from "@/env";

interface RowData {
  id: number;
  title: string;
  used: number;
  category: string;
  checked: boolean;
}

function classifyHashtag(hashtag: string): string {
  const hashtagDictionary: { [key: string]: string } = {
    rajasthankelabharthi: "Geographic",
    playlist: "Topic",
    secawards: "Event",
    jake: "Topic",
    artistaasiatico: "Topic",
    tiktok: "Brand",
    vivaelpoderpopular: "Campaign",
    airdrop: "Topic",
    bts: "Brand",
    mandatoryspending: "Topic",
    partaikebangkitanbangsa: "Campaign",
    crypto: "Topic",
    sb19: "Brand",
    wtcfinal2023: "Event",
    psyopbsc: "Campaign",
    rm: "Brand",
    taketwo: "Brand",
    top100kpopvocalists: "Topic",
    bitcoin: "Topic",
    nft: "Topic",
  };

  return hashtagDictionary[hashtag] || "Top Stories";
}

export default async function getTrendingTags(): Promise<RowData[]> {
  try {
    const url = `${env.RITEKIT_TRENDS_REALTIME_URL}&client_id=${env.RITEKIT_TRENDS_API_KEY}`;
    const { data } = await axios.get(url);
    return data.tags.map((tag: any, index: number) => ({
      id: index + 1,
      title: `#${tag.tag}`,
      used: tag.exposure,
      category: classifyHashtag(tag.tag),
      checked: false,
    }));
  } catch (error) {
    console.error("Error fetching daily data:", error);
    return [];
  }
}
