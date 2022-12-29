import { DBSchema, IDBPDatabase, openDB } from "idb";
import { Snippet, Upsertable } from "../types/Domain";
import { createId } from "./idHelpers";
import { sampleSnippets } from "./sampleData";

const Sdb = {
  dbName: "DBNAME_snippets",
  stores: {
    snippets: "snippets",
  },
  indexes: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
} as const;

interface SnippetDb extends DBSchema {
  snippets: {
    value: Snippet;
    key: string;
    indexes: {
      [Sdb.indexes.createdAt]: Snippet["createdAt"];
      [Sdb.indexes.updatedAt]: Snippet["updatedAt"];
    };
  };
}

class SnippetRepository {
  dbPromise: Promise<IDBPDatabase<SnippetDb>>;
  constructor() {
    this.dbPromise = openDB<SnippetDb>(Sdb.dbName, 1, {
      upgrade(db) {
        const snippetStore = db.createObjectStore(Sdb.stores.snippets, {
          keyPath: "id",
        });
        snippetStore.createIndex(Sdb.indexes.createdAt, "createdAt");
        snippetStore.createIndex(Sdb.indexes.updatedAt, "updatedAt");
      },
    });
  }

  async getAllSnippets() {
    const db = await this.dbPromise;
    const snippets = await db.getAllFromIndex(
      Sdb.stores.snippets,
      Sdb.indexes.createdAt
    );
    snippets.reverse();
    if (snippets.length) return snippets;
    return await this.insertSampleSnippets();
  }

  async insertSampleSnippets() {
    console.debug("Inserting sameple snippets");
    const outputSnips: Snippet[] = [];
    const reversedSampleSnippets = [...sampleSnippets].reverse();
    for (const snip of reversedSampleSnippets) {
      outputSnips.push(await this.upsertSnippet(snip));
    }
    return outputSnips.reverse();
  }

  async upsertSnippet(snippet: Upsertable<Snippet>): Promise<Snippet> {
    const db = await this.dbPromise;
    const completeSnippet: Snippet = {
      id: createId(),
      createdAt: new Date(),
      ...snippet,
      updatedAt: new Date(),
    };
    console.debug("Upserting snippet", completeSnippet);
    await db.put(Sdb.stores.snippets, completeSnippet);
    return completeSnippet;
  }

  async deleteSnippet(id: string): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(Sdb.stores.snippets, id);
  }
}

export const snippetRepository = new SnippetRepository();
