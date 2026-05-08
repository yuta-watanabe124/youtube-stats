import { ChannelStats } from "./youtube.js";

function formatNumber(num: string): string {
  return Number(num).toLocaleString("ja-JP");
}

function today(): string {
  return new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function generateDashboardHtml(stats: ChannelStats): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: #fff;
      width: 1200px;
      height: 630px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 48px;
    }
    .header {
      margin-bottom: 32px;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #e94560;
      margin-bottom: 8px;
    }
    .header .date {
      font-size: 16px;
      color: #aaa;
    }
    .channel-name {
      font-size: 22px;
      font-weight: 600;
      margin-bottom: 40px;
      color: #fff;
    }
    .stats {
      display: flex;
      gap: 32px;
    }
    .stat-card {
      flex: 1;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 16px;
      padding: 28px;
      text-align: center;
    }
    .stat-card .label {
      font-size: 14px;
      color: #aaa;
      margin-bottom: 12px;
      letter-spacing: 0.05em;
    }
    .stat-card .value {
      font-size: 42px;
      font-weight: 800;
      color: #fff;
      line-height: 1;
    }
    .stat-card .unit {
      font-size: 16px;
      color: #aaa;
      margin-top: 8px;
    }
    .stat-card.highlight .value {
      color: #e94560;
    }
    .footer {
      margin-top: 32px;
      font-size: 13px;
      color: #666;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 YouTubeチャンネルレポート</h1>
    <div class="date">${today()}</div>
  </div>
  <div class="channel-name">📺 ${stats.title}</div>
  <div class="stats">
    <div class="stat-card highlight">
      <div class="label">登録者数</div>
      <div class="value">${formatNumber(stats.subscriberCount)}</div>
      <div class="unit">人</div>
    </div>
    <div class="stat-card">
      <div class="label">総再生数</div>
      <div class="value">${formatNumber(stats.viewCount)}</div>
      <div class="unit">回</div>
    </div>
    <div class="stat-card">
      <div class="label">動画本数</div>
      <div class="value">${formatNumber(stats.videoCount)}</div>
      <div class="unit">本</div>
    </div>
  </div>
  <div class="footer">自動生成 by YouTube統計Bot</div>
</body>
</html>`;
}
