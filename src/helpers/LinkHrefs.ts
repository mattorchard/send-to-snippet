const shouldMock = window.location.host.startsWith("localhost");

const relUrl = (fileName: string) =>
  shouldMock ? `/${fileName}` : chrome.runtime.getURL(fileName);

export const LinkHrefs = {
  sandbox: relUrl("sandbox.html"),
  snippets: relUrl("snippets.html"),
  options: relUrl("options.html"),
};
