import axios from "axios";

export interface ChannelStats {
  title: string;
  subscriberCount: string;
  viewCount: string;
  videoCount: string;
}

export async function fetchChannelStats(
  apiKey: string,
  channelId: string
): Promise<ChannelStats> {
  const url = "https://www.googleapis.com/youtube/v3/channels";
  const response = await axios.get(url, {
    params: {
      part: "snippet,statistics",
      id: channelId,
      key: apiKey,
    },
  });

  const item = response.data.items?.[0];
  if (!item) {
    throw new Error(`チャンネルID「${channelId}」が見つかりませんでした`);
  }

  return {
    title: item.snippet.title,
    subscriberCount: item.statistics.subscriberCount ?? "非公開",
    viewCount: item.statistics.viewCount ?? "0",
    videoCount: item.statistics.videoCount ?? "0",
  };
}
