import path from "path";
import { fileURLToPath } from "url";

let currMetaUrl: string = import.meta.url;
export const setCurrMetaUrl = (url: string) => {
  currMetaUrl = url;
};
export const __filename = () => fileURLToPath(currMetaUrl);
export const __dirname = () => path.dirname(__filename());
