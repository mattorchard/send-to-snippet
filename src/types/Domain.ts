export type ContextMenuInfo = chrome.contextMenus.OnClickData & {
  manualSelectionText: string | null;
};

export interface MailboxDrop extends Entity {
  contextMenuInfo: ContextMenuInfo;
  sourceTabId: number | null;
  targetTabId: number;
}

export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Snippet extends Entity {
  title: string;
  script: string;
}

export type Upsertable<T extends Entity> = Partial<Entity> &
  Omit<T, keyof Entity>;
