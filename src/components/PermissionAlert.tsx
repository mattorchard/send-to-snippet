import { Fragment, FunctionComponent, h } from "preact";
import { useState } from "preact/hooks";
import { useScriptingPermissions } from "../hooks/useScriptingPermissions";
import { Alert } from "./Alert";
import { Button } from "./Button";

export const PermissionAlert: FunctionComponent = () => {
  const { isLoading, hasAccess, initiallyHadAccess, requestAccess } =
    useScriptingPermissions();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isLoading) return null;
  if (hasAccess && initiallyHadAccess) return null;
  if (isDismissed) return null;

  if (!initiallyHadAccess && hasAccess)
    return (
      <Alert
        intent="success"
        title="Permission Granted"
        body={
          <p>
            Thanks! Next time you <strong>Send 2 Snippet</strong> we'll try to
            grab multi-line text.
          </p>
        }
        action={<Button onClick={() => setIsDismissed(true)}>Dismiss</Button>}
      />
    );

  return (
    <Alert
      intent="warning"
      title="Optional Permission"
      body={
        <p>
          We need additional permission to be able to deliver multi-line input.
        </p>
      }
      action={
        <Fragment>
          <Button intent="warning" onClick={requestAccess}>
            Grant permission
          </Button>
        </Fragment>
      }
    />
  );
};
