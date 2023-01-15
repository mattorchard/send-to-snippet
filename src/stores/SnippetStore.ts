import {
  bulkUpsert,
  deleteEntity,
  upsertEntity,
} from "../helpers/entityHelpers";
import { extension } from "../helpers/Extension";
import { combineIdentifiers } from "../helpers/idHelpers";
import { Logger } from "../helpers/Logger";
import { Observable } from "../helpers/Observable";
import { sampleSnippets, sampleSnippetSkeleton } from "../helpers/sampleData";
import { EntityId, Snippet, Upsertable } from "../types/Domain";
import { Jsonified, PromiseState } from "../types/UtilityTypes";

const logger = new Logger("SnippetStore");

type SnippetStorePromiseState = PromiseState<Snippet[] | null, "snippets">;

type SnippetObserver = (state: SnippetStorePromiseState) => void;

export class SnippetStore {
  private static readonly StorageKey = combineIdentifiers("Snippets", "v1");
  private readonly observable = new Observable<SnippetStorePromiseState>({
    error: null,
    isLoading: true,
    snippets: null,
  });

  constructor() {
    this.init();
  }

  private init = () => {
    extension.getStorage([SnippetStore.StorageKey], (data) => {
      const snippetData = data[SnippetStore.StorageKey];
      this.handleSnippetChange(snippetData);
    });
    extension.addStorageListener((changes) => {
      if (!(SnippetStore.StorageKey in changes)) return;
      const snippetData = changes[SnippetStore.StorageKey].newValue;
      this.handleSnippetChange(snippetData);
    });
  };

  private handleSnippetChange = (rawSnippetData: unknown) => {
    const isEmptyArray =
      Array.isArray(rawSnippetData) && rawSnippetData.length === 0;
    if (!rawSnippetData || isEmptyArray) {
      this.injectSamples();
      return;
    }
    if (!Array.isArray(rawSnippetData)) {
      this.observable.setCurrentValue({
        snippets: this.observable.value.snippets,
        isLoading: false,
        error: new Error(`Store returned malformed snippets`),
      });
      return;
    }

    const snippets = rawSnippetData.map(SnippetStore.fromSerial);
    logger.debug("Snippets changed", snippets);
    this.observable.setCurrentValue({
      snippets,
      isLoading: false,
      error: null,
    });
  };

  private saveSnippets = (snippets: Snippet[]) =>
    extension.setStorage({
      [SnippetStore.StorageKey]: snippets.map(SnippetStore.toSerial),
    });

  private applySnippetChange = async (
    transformSnippets: (oldSnippets: Snippet[]) => Snippet[]
  ) => {
    if (!this.observable.value.snippets)
      throw new Error(`Cannot modify snippets before snippets have loaded`);
    const newSnippets = transformSnippets(this.observable.value.snippets);
    await this.saveSnippets(newSnippets);
    this.observable.setCurrentValue({
      error: null,
      isLoading: false,
      snippets: newSnippets,
    });
  };

  public deleteSnippet = async (idToDelete: EntityId) =>
    this.applySnippetChange((snippets) => deleteEntity(snippets, idToDelete));

  public upsertSnippet = (snippetToUpsert: Upsertable<Snippet>) =>
    this.applySnippetChange((snippets) =>
      upsertEntity(snippets, snippetToUpsert)
    );

  public createSnippet = () =>
    this.applySnippetChange((snippets) =>
      upsertEntity(snippets, sampleSnippetSkeleton)
    );

  private injectSamples = async () => {
    const newSnippets = bulkUpsert([], sampleSnippets);
    logger.debug("Injecting samples", newSnippets);
    await this.saveSnippets(newSnippets);
    this.observable.setCurrentValue({
      error: null,
      isLoading: false,
      snippets: newSnippets,
    });
  };

  public getCurrentValue = () => this.observable.value;

  public subscribe = (observer: SnippetObserver) =>
    this.observable.subscribe(observer);

  private static toSerial = (snippet: Snippet): Jsonified<Snippet> => ({
    ...snippet,
    createdAt: snippet.createdAt.toISOString(),
    updatedAt: snippet.updatedAt.toISOString(),
  });

  private static fromSerial = (snippet: Jsonified<Snippet>): Snippet => ({
    ...snippet,
    createdAt: new Date(snippet.createdAt),
    updatedAt: new Date(snippet.updatedAt),
  });
}

export const snippetStore = new SnippetStore();
