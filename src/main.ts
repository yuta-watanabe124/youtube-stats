import "dotenv/config";
import { fetchChannelStats } from "./youtube.js";
import { generateDashboardHtml } from "./dashboard.js";
import { takeScreenshot } from "./screenshot.js";
import { postImageToSlack } from "./slack.js";
import { saveHistory, loadHistory } from "./history.js";

async function main() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;
  const slackToken = process.env.SLACK_BOT_TOKEN;
  const slackChannel = process.env.SLACK_CHANNEL;

  if (!apiKey || !channelId || !slackToken || !slackChannel) {
    throw new Error(".env の環境変数が不足しています。.env.example を確認してください。");
  }

  console.info("[1/5] YouTubeチャンネルのデータを取得中...");
  const stats = await fetchChannelStats(apiKey, channelId);
  console.info(`→ チャンネル名: ${stats.title}`);
  console.info(`→ 登録者数: ${stats.subscriberCount}`);

  console.info("[2/5] 履歴データを保存中...");
  const dateStr = new Date().toISOString().slice(0, 10);
  const history = saveHistory({
    date: dateStr,
    subscribers: Number(stats.subscriberCount),
    views: Number(stats.viewCount),
    videos: Number(stats.videoCount),
  });

  console.info("[3/5] ダッシュボードHTMLを生成中...");
  const html = generateDashboardHtml(stats, history);

  console.info("[4/5] スクリーンショットを撮影中...");
  const imagePath = await takeScreenshot(html);

  console.info("[5/5] Slackに投稿中...");
  await postImageToSlack(imagePath, slackToken, slackChannel, "📊 YouTubeチャンネルレポート");

  console.info("すべての処理が完了しました");
}

main().catch((error: unknown) => {
  console.error("エラーが発生しました:", error);
  process.exit(1);
});
