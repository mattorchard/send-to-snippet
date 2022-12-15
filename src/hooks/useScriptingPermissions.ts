import { useCallback, useEffect, useState } from "preact/hooks";
import { ScriptingManager } from "../helpers/ScriptingManager";

export const useScriptingPermissions = () => {
  const [initiallyHadAccess, setInitiallyHadAccess] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ScriptingManager.hasAccess().then((granted) => {
      setHasAccess(granted);
      setInitiallyHadAccess(granted);
      setIsLoading(false);
    });
  }, []);

  const requestAccess = useCallback(async () => {
    const granted = await ScriptingManager.askUserToGrantAccess();
    setHasAccess(granted);
  }, []);

  return {
    requestAccess,
    hasAccess,
    isLoading,
    initiallyHadAccess,
  };
};
