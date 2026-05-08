import * as fs from "fs";
import axios from "axios";

export async function postImageToSlack(
  imagePath: string,
  token: string,
  channel: string,
  title: string
): Promise<void> {
  const fileBuffer = fs.readFileSync(imagePath);
  const fileSize = fs.statSync(imagePath).size;

  // Step 1: アップロードURLを取得
  const urlRes = await axios.post(
    "https://slack.com/api/files.getUploadURLExternal",
    new URLSearchParams({
      filename: "youtube-stats.png",
      length: String(fileSize),
    }),
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (!urlRes.data.ok) {
    throw new Error(`Slack投稿エラー(getUploadURL): ${urlRes.data.error}`);
  }

  const { upload_url, file_id } = urlRes.data;

  // Step 2: ファイルをアップロード
  await axios.post(upload_url, fileBuffer, {
    headers: {
      "Content-Type": "image/png",
    },
  });

  // Step 3: アップロードを完了してチャンネルに投稿
  const completeRes = await axios.post(
    "https://slack.com/api/files.completeUploadExternal",
    {
      files: [{ id: file_id, title }],
      channel_id: channel,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!completeRes.data.ok) {
    throw new Error(`Slack投稿エラー(completeUpload): ${completeRes.data.error}`);
  }

  console.info("→ Slackに画像を投稿しました");
}
