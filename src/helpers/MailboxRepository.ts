import { DBSchema, IDBPDatabase, openDB } from "idb";
import { MailboxDrop, Snippet, Upsertable } from "../types/Domain";
import { config } from "./config";
import { createId } from "./idHelpers";

const Mdb = {
  dbName: "DBNAME_mailbox",
  stores: {
    drops: "drops",
  },
  indexes: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
} as const;

interface MailboxDb extends DBSchema {
  drops: {
    value: MailboxDrop;
    key: string;
    indexes: {
      [Mdb.indexes.createdAt]: MailboxDrop["createdAt"];
      [Mdb.indexes.updatedAt]: MailboxDrop["updatedAt"];
    };
  };
}
class MailboxRepository {
  private static readonly DROP_COUNT = config.MAX_MAILBOX_DROPS;
  private static readonly PRUNE_DELAY = config.MAILBOX_PRUNE_DELAY;
  private readonly dbPromise: Promise<IDBPDatabase<MailboxDb>>;

  constructor() {
    this.dbPromise = openDB<MailboxDb>(Mdb.dbName, 1, {
      upgrade(db) {
        const dropStore = db.createObjectStore(Mdb.stores.drops, {
          keyPath: "id",
        });
        dropStore.createIndex(Mdb.indexes.createdAt, "createdAt");
        dropStore.createIndex(Mdb.indexes.updatedAt, "updatedAt");
      },
    });
  }

  async getDrop(id: string) {
    const db = await this.dbPromise;
    return (await db.get(Mdb.stores.drops, id)) ?? null;
  }

  async upsertDrop(partialDrop: Upsertable<MailboxDrop>): Promise<MailboxDrop> {
    const db = await this.dbPromise;

    const completeDrop: MailboxDrop = {
      id: createId(),
      createdAt: new Date(),
      ...partialDrop,
      updatedAt: new Date(),
    };
    console.debug("Upserting mailbox drop", completeDrop);
    db.put(Mdb.stores.drops, completeDrop);
    this.pruneBufferInBackground();
    return completeDrop;
  }

  private pruneBufferInBackground() {
    setTimeout(async () => {
      try {
        await this.pruneBuffer();
      } catch (error) {
        console.warn("Failed to prune mailbox drops", error);
      }
    }, MailboxRepository.PRUNE_DELAY);
  }

  private async pruneBuffer() {
    const db = await this.dbPromise;
    const currentCount = await db.count(Mdb.stores.drops);
    if (currentCount <= MailboxRepository.DROP_COUNT) return;

    const countToDelete = currentCount - MailboxRepository.DROP_COUNT;
    const dropsToDelete = await this.getOldestDrops(countToDelete);

    console.debug("Pruning drop buffer", { countToDelete, dropsToDelete });
    // Intentionally performed in isolation, rather than transactionally
    await Promise.all(dropsToDelete.map((drop) => this.deleteDrop(drop.id)));
  }

  private async deleteDrop(id: string) {
    const db = await this.dbPromise;
    await db.delete(Mdb.stores.drops, id);
  }

  private async getOldestDrops(dropCount: number) {
    const db = await this.dbPromise;
    const oldestDrops = new Array<MailboxDrop>();
    if (dropCount < 1) return oldestDrops;

    let cursor = await db
      .transaction(Mdb.stores.drops, "readonly")
      .store.index(Mdb.indexes.createdAt)
      .openCursor();
    while (cursor) {
      oldestDrops.push(cursor.value);
      if (oldestDrops.length >= dropCount) break;
      cursor = await cursor.continue();
    }

    return oldestDrops;
  }
}
export const mailboxRepository = new MailboxRepository();
