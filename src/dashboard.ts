import { ChannelStats } from "./youtube.js";
import { HistoryEntry } from "./history.js";

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

export function generateDashboardHtml(stats: ChannelStats, history: HistoryEntry[]): string {
  const labels = history.map((e) => e.date.slice(5));
  const subscriberData = history.map((e) => e.subscribers);
  const viewData = history.map((e) => e.views);

  const hasHistory = history.length >= 2;

  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", sans-serif;
      background: linear-gradient(135deg, #0a0e1a 0%, #0d1b3e 50%, #0f2458 100%);
      color: #fff;
      width: 1200px;
      height: ${hasHistory ? "800px" : "630px"};
      padding: 44px 48px 36px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    /* Header */
    .header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .header-left h1 {
      font-size: 26px;
      font-weight: 800;
      background: linear-gradient(90deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 6px;
    }
    .header-left .channel {
      font-size: 15px;
      color: #94a3b8;
    }
    .header-right .date {
      font-size: 14px;
      color: #64748b;
      text-align: right;
      margin-top: 4px;
    }

    /* Stats */
    .stats {
      display: flex;
      gap: 20px;
      margin-bottom: ${hasHistory ? "28px" : "0"};
    }
    .stat-card {
      flex: 1;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 24px 20px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .stat-card::after {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
    }
    .stat-card.s1::after { background: linear-gradient(90deg, #60a5fa, #3b82f6); }
    .stat-card.s2::after { background: linear-gradient(90deg, #a78bfa, #7c3aed); }
    .stat-card.s3::after { background: linear-gradient(90deg, #34d399, #10b981); }

    .stat-card .label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 10px;
      letter-spacing: 0.08em;
    }
    .stat-card .value {
      font-size: 44px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -0.02em;
    }
    .stat-card.s1 .value { color: #60a5fa; }
    .stat-card.s2 .value { color: #a78bfa; }
    .stat-card.s3 .value { color: #34d399; }
    .stat-card .unit {
      font-size: 13px;
      color: #64748b;
      margin-top: 8px;
    }

    /* Graph */
    .graph-section {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.07);
      border-radius: 20px;
      padding: 24px;
      flex: 1;
    }
    .graph-title {
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .chart-wrap {
      position: relative;
      height: 200px;
    }

    .footer {
      margin-top: 16px;
      font-size: 11px;
      color: #334155;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>三川燃料店 YouTube レポート</h1>
      <div class="channel">📺 ${stats.title}</div>
    </div>
    <div class="header-right">
      <div class="date">${today()}</div>
    </div>
  </div>

  <div class="stats">
    <div class="stat-card s1">
      <div class="label">登録者数</div>
      <div class="value">${formatNumber(stats.subscriberCount)}</div>
      <div class="unit">人</div>
    </div>
    <div class="stat-card s2">
      <div class="label">総再生数</div>
      <div class="value">${formatNumber(stats.viewCount)}</div>
      <div class="unit">回</div>
    </div>
    <div class="stat-card s3">
      <div class="label">動画本数</div>
      <div class="value">${formatNumber(stats.videoCount)}</div>
      <div class="unit">本</div>
    </div>
  </div>

  ${hasHistory ? `
  <div class="graph-section">
    <div class="graph-title">📈 登録者数の推移</div>
    <div class="chart-wrap">
      <canvas id="chart"></canvas>
    </div>
  </div>
  <script>
    const ctx = document.getElementById("chart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ${JSON.stringify(labels)},
        datasets: [
          {
            label: "登録者数",
            data: ${JSON.stringify(subscriberData)},
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96,165,250,0.1)",
            borderWidth: 2.5,
            pointBackgroundColor: "#60a5fa",
            pointRadius: 4,
            tension: 0.4,
            fill: true,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#64748b", font: { size: 11 } }
          },
          y: {
            grid: { color: "rgba(255,255,255,0.05)" },
            ticks: { color: "#64748b", font: { size: 11 } }
          }
        }
      }
    });
  </script>
  ` : ""}

  <div class="footer">自動生成 by YouTube統計Bot</div>
</body>
</html>`;
}
