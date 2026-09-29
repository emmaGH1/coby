import * as SQLite from 'expo-sqlite';
import type { CobyItem } from '../domain/types';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function database(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync('coby.db').then(async (db) => {
      await db.execAsync(`CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL
      );`);
      return db;
    });
  }
  return databasePromise;
}

export async function listItems(): Promise<CobyItem[]> {
  const db = await database();
  const rows = await db.getAllAsync<{ payload: string }>('SELECT payload FROM items ORDER BY created_at, id');
  return rows.map((row) => JSON.parse(row.payload) as CobyItem);
}

export async function saveItems(items: CobyItem[]): Promise<void> {
  const db = await database();
  await db.withTransactionAsync(async () => {
    for (const item of items) {
      await db.runAsync('INSERT OR REPLACE INTO items (id, payload, status, created_at) VALUES (?, ?, ?, ?)',
        item.id, JSON.stringify(item), item.status, item.createdAt);
    }
  });
}

export async function completeItem(item: CobyItem, completedAt: string): Promise<void> {
  await saveItems([{ ...item, status: 'completed', completedAt }]);
}
