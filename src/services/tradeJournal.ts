import { JournalEntry, JournalStats } from "@/types/trade-journal";

const STORAGE_KEY = "trade_journal";

export function saveTradeToJournal(entry: JournalEntry): void {
  const journal = getJournal();
  journal.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
}

export function getJournal(): JournalEntry[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function updateJournalEntry(id: string, updates: Partial<JournalEntry>): void {
  const journal = getJournal();
  const index = journal.findIndex(entry => entry.id === id);
  if (index !== -1) {
    journal[index] = { ...journal[index], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
  }
}

export function deleteJournalEntry(id: string): void {
  const journal = getJournal();
  const filtered = journal.filter(entry => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function calculateJournalStats(): JournalStats {
  const journal = getJournal();
  const closedTrades = journal.filter(entry => entry.status === "closed" && entry.profit !== undefined);
  
  const winningTrades = closedTrades.filter(t => (t.profit || 0) > 0);
  const losingTrades = closedTrades.filter(t => (t.profit || 0) < 0);
  
  const totalProfit = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const totalWins = winningTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit || 0), 0));
  
  return {
    totalTrades: closedTrades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
    totalProfit,
    avgWin: winningTrades.length > 0 ? totalWins / winningTrades.length : 0,
    avgLoss: losingTrades.length > 0 ? totalLosses / losingTrades.length : 0,
    profitFactor: totalLosses > 0 ? totalWins / totalLosses : 0,
    largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.profit || 0)) : 0,
    largestLoss: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.profit || 0)) : 0,
  };
}

export function exportJournal(): string {
  return JSON.stringify(getJournal(), null, 2);
}

export function importJournal(data: string): boolean {
  try {
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      localStorage.setItem(STORAGE_KEY, data);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
