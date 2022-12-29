import { extension } from "../helpers/Extension";
import { createId } from "../helpers/idHelpers";
import { LinkHrefs } from "../helpers/LinkHrefs";
import { mailboxRepository } from "../helpers/MailboxRepository";
import { getManualSelectionText } from "../helpers/selectionHelper";

console.log("Hello from S2S Service worker", new Date().toTimeString());

extension
  .setAllContextMenus([
    { contexts: ["all"], id: "S2S", title: "Send 2 Snippet" },
  ])
  .catch((error) => console.error(`Failed to create context menu item`, error));

extension.addOnContextMenuClicked(async (baseContextMenuInfo, sourceTab) => {
  console.log("Context menu clicked", { baseContextMenuInfo, sourceTab });

  const targetId = createId();
  await mailboxRepository.upsertDrop({
    targetId,
    sourceTabId: sourceTab?.id ?? null,
    contextMenuInfo: {
      ...baseContextMenuInfo,
      manualSelectionText: await getManualSelectionText(
        sourceTab?.id ?? null,
        baseContextMenuInfo.frameId ?? null
      ),
    },
  });
  await extension.createTab(LinkHrefs.snippetTarget(targetId));
});

export default {};
