import { extension } from "./Extension";
import { buildUrl } from "./UrlHelpers";

export const LinkHrefs = {
  sandbox: extension.getUrl("sandbox.html"),
  options: extension.getUrl("options.html"),
  snippetTarget: (targetId: string) =>
    buildUrl(extension.getUrl("snippets.html"), {
      search: { targetId },
    }).toString(),
};
