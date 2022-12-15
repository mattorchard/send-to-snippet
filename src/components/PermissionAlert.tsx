import { Fragment, FunctionComponent, h, JSX } from "preact";
import { useState } from "preact/hooks";
import { useScriptingPermissions } from "../hooks/useScriptingPermissions";
import { Box } from "./Box";
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

const Alert: FunctionComponent<{
  intent: "success" | "warning";
  title: string;
  body: JSX.Element;
  action: JSX.Element;
}> = ({ intent, title, body, action }) => (
  <Box
    className={`alert alert--${intent}`}
    flexDirection="column"
    gap={0.25}
    pl={1}
  >
    <h4 className="h4">{title}</h4>
    <div>{body}</div>
    <div>{action}</div>
  </Box>
);
