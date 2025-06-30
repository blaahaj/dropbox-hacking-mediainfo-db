import { files } from "dropbox";
import FileMetadata = files.FileMetadata;

import type { MediainfoData } from "./types.js";

export type Fetcher = {
  fetch: (item: FileMetadata) => Promise<MediainfoData>;
};
