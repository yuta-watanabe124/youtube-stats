import * as fs from "fs";
import * as path from "path";

export interface HistoryEntry {
  date: string;
  subscribers: number;
  views: number;
  videos: number;
}

const HISTORY_PATH = path.join(process.cwd(), "history.json");

export function loadHistory(): HistoryEntry[] {
  if (!fs.existsSync(HISTORY_PATH)) return [];
  try {
    const raw = fs.readFileSync(HISTORY_PATH, "utf-8");
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entry: HistoryEntry): HistoryEntry[] {
  const history = loadHistory();
  const today = entry.date;

  const existingIndex = history.findIndex((e) => e.date === today);
  if (existingIndex >= 0) {
    history[existingIndex] = entry;
  } else {
    history.push(entry);
  }

  // 直近30件だけ保持
  const trimmed = history.slice(-30);
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(trimmed, null, 2), "utf-8");
  console.info(`→ 履歴を保存しました（${trimmed.length}件）`);
  return trimmed;
}
