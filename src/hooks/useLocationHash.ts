import { useCallback, useEffect, useState } from "preact/hooks";
import { useWindowEvent } from "./useWindowEvent";

const getHash = () => window.location.hash.replace(/^#/, "");

export const useLocationHash = () => {
  const [hash, setHash] = useState(getHash);
  const handleHashChange = useCallback(() => setHash(getHash), []);
  useWindowEvent("hashchange", handleHashChange);
  return hash;
};
