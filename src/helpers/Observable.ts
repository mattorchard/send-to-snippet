import { AggregateErrorBuilder } from "./errorHelpers";
import { Logger } from "./Logger";

type Observer<T> = (value: T) => void;

const logger = new Logger("Observable");
export class Observable<T> {
  private readonly subscribers = new Set<Observer<T>>();
  private currentValue: T;
  constructor(initialValue: T) {
    this.currentValue = initialValue;
  }

  public get value() {
    return this.currentValue;
  }

  public setCurrentValue(value: T) {
    this.currentValue = value;
    this.notifySubscribers();
  }

  private notifySubscribers() {
    try {
      const errorBuilder = new AggregateErrorBuilder();
      for (const sub of this.subscribers) {
        try {
          sub(this.currentValue);
        } catch (error) {
          errorBuilder.push(error);
        }
      }
      errorBuilder.check();
    } catch (error) {
      logger.error("Observer error", error);
    }
  }

  public subscribe(observer: Observer<T>) {
    this.subscribers.add(observer);
    return () => this.subscribers.delete(observer);
  }
}
