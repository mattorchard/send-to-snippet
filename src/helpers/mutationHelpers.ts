export const onFirstMutation = (callback: () => void) => {
  const mutationObserver = new MutationObserver(() => {
    mutationObserver.disconnect();
    callback();
  });

  mutationObserver.observe(document.documentElement, {
    attributes: true,
    characterData: true,
    subtree: true,
    childList: true,
  });
};
