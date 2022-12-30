type LogLevel = "debug" | "info" | "warn" | "error";

export class Logger {
  private static readonly PREFIX_STYLE = "font-style:italic";
  private static readonly RESET_STYLE = "";

  constructor(private readonly prefix: string) {}

  private log(level: LogLevel, message: string, ...args: any[]) {
    console[level](
      `[%c${this.prefix}%c] ${message}`,
      Logger.PREFIX_STYLE,
      Logger.RESET_STYLE,
      ...args
    );
  }

  public debug(message: string, ...args: any[]) {
    this.log("debug", message, ...args);
  }

  public info(message: string, ...args: any[]) {
    this.log("info", message, ...args);
  }

  public warn(message: string, ...args: any[]) {
    this.log("warn", message, ...args);
  }

  public error(message: string, ...args: any[]) {
    this.log("error", message, ...args);
  }
}
