export type ContextMenuInfo = chrome.contextMenus.OnClickData & {
  manualSelectionText: string | null;
};

export interface MailboxDrop extends Entity {
  contextMenuInfo: ContextMenuInfo;
  sourceTabId: number | null;
}

export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EntityId = Entity["id"];

export interface Snippet extends Entity {
  title: string;
  script: string;
}

export type Upsertable<T extends Entity> = Partial<Entity> &
  Omit<T, keyof Entity>;

export type Updateable<T extends Entity> = Upsertable<T> & Pick<Entity, "id">;
