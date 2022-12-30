import { wrapError } from "../helpers/errorHelpers";
import { combineIdentifiers } from "../helpers/idHelpers";
import { Logger } from "../helpers/Logger";
import { Observable } from "../helpers/Observable";
import { sampleSnippetSkeleton } from "../helpers/sampleData";
import { snippetRepository } from "../helpers/SnippetRepository";
import { Snippet, Upsertable } from "../types/Domain";
import { PromiseState } from "../types/UtilityTypes";

const logger = new Logger("SnippetStore");

type SnippetStorePromiseState = PromiseState<Snippet[] | null, "snippets">;

type SnippetObserver = (state: SnippetStorePromiseState) => void;

class SnippetStore {
  private readonly observable = new Observable<SnippetStorePromiseState>({
    error: null,
    isLoading: true,
    snippets: null,
  });
  private readonly channel: BroadcastChannel;

  constructor() {
    this.channel = new BroadcastChannel(
      combineIdentifiers("SnippetStore", "v1")
    );
    this.channel.addEventListener("message", (event) =>
      this.onMessageEvent(event)
    );
    this.channel.addEventListener("messageerror", (event) =>
      logger.error("Message error", event)
    );
    this.setupInitialSnippets();
  }

  private setupInitialSnippets = async () => {
    try {
      const snippets = await snippetRepository.getAllSnippets();
      if (!this.observable.value.isLoading) return;
      this.setSnippets(snippets);
    } catch (error) {
      logger.error(`Failed to get snippets`, error);
      this.observable.setCurrentValue({
        snippets: null,
        isLoading: false,
        error: wrapError(error),
      });
    }
  };

  private setSnippets = (snippets: Snippet[]) => {
    this.observable.setCurrentValue({
      snippets,
      isLoading: false,
      error: null,
    });
  };

  private onMessageEvent = (event: MessageEvent<SnippetStoreMessage>) => {
    logger.debug("Message received", event.data);
    switch (event.data.kind) {
      case "snippets-changed":
        this.setSnippets(event.data.snippets);
        break;
    }
  };

  private postMessage = (message: SnippetStoreMessage) => {
    logger.debug("Sending message", message);
    this.channel.postMessage(message);
  };

  private notifyOtherFramesSnippetsChanged = () => {
    if (!this.snippets) return;
    this.postMessage({ kind: "snippets-changed", snippets: this.snippets });
  };

  public deleteSnippet = async (idToDelete: string) => {
    if (!this.snippets) throw new Error(`Cannot delete snippet before loaded`);

    await snippetRepository.deleteSnippet(idToDelete);

    this.setSnippets(this.snippets.filter((snip) => snip.id !== idToDelete));
    this.notifyOtherFramesSnippetsChanged();
  };

  public upsertSnippet = async (snippetToUpsert: Upsertable<Snippet>) => {
    if (!this.snippets) throw new Error(`Cannot upsert snippet before loaded`);

    const upsertedSnip = await snippetRepository.upsertSnippet(snippetToUpsert);

    const wasUpdate = Boolean(snippetToUpsert.id);
    if (wasUpdate) {
      this.setSnippets(
        this.snippets.map((snip) =>
          snip.id === snippetToUpsert.id ? upsertedSnip : snip
        )
      );
    } else {
      this.setSnippets([upsertedSnip, ...this.snippets]);
    }
    this.notifyOtherFramesSnippetsChanged();
  };

  public createSnippet = async () => {
    await this.upsertSnippet({ ...sampleSnippetSkeleton });
  };

  private get snippets() {
    return this.observable.value.snippets;
  }

  public getCurrentValue = () => {
    return this.observable.value;
  };

  public subscribe = (observer: SnippetObserver) => {
    return this.observable.subscribe(observer);
  };
}

type SnippetStoreMessage = {
  kind: "snippets-changed";
  snippets: Snippet[];
};

export const snippetStore = new SnippetStore();
