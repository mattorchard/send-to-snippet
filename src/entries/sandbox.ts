console.log("Hello from sandbox");
window.onmessage = async ({ data }) => {
  console.log("Sandbox received data", data);
  try {
    const func = new Function("input", data.script);
    const response = await func.apply(window, [data.inputText]);
    console.log("Sandbox calculated response", response);
    window.top!.postMessage(response, "*");
  } catch (error) {
    console.error(`Error in sandbox script execution`, error);
  }
};
