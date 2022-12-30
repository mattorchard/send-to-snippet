import { v4 as uuidV4 } from "uuid";
export const createId = () => uuidV4();
export const combineIdentifiers = (...parts: string[]) => parts.join("::");
