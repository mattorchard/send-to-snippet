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

export const SnippetOutputTypeData = [
  {
    value: "text",
    label: "Text",
    description: "Returns the input transformed as text.",
  },
  {
    value: "effect",
    label: "Effect",
    description: "Performs some side effect with no visual component.",
    autoRun: false,
  },
  {
    value: "document",
    label: "Document",
    description: "Draws output in the iFrame's DOM.",
  },
] as const;

export const SnippetOutputTypeDataRecord = Object.fromEntries(
  SnippetOutputTypeData.map((data) => [data.value, data])
);

export type SnippetOutputType = typeof SnippetOutputTypeData[number]["value"];

export interface Snippet extends Entity {
  title: string;
  description: string;
  script: string;
  outputType: SnippetOutputType;
}

export type Upsertable<T extends Entity> = Partial<Entity> &
  Omit<T, keyof Entity>;
