import { Dropbox, files } from "dropbox";
import FileMetadata = files.FileMetadata;
import { execFile } from "node:child_process";

import { GlobalOptions, PromiseLimiter } from "@blaahaj/dropbox-hacking-util";

import { MediainfoData } from "./types.js";
import type { Fetcher } from "./fetcher.js";
import * as dl from "@blaahaj/dropbox-hacking-downloader";
import { promisify } from "node:util";
import { unlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import { randomUUID } from "node:crypto";
import { join } from "node:path";

const generateTmpFileName = (rev: string) =>
  Promise.resolve(join(tmpdir(), `mediainfo-download-${rev}-${randomUUID()}`));

const downloadToFile = async (
  dbx: Dropbox,
  item: FileMetadata,
  tmpFile: string,
  inactivityTimeout: number,
  limiter: PromiseLimiter<void>,
) => {
  console.log(`Downloading ${item.path_lower} to ${tmpFile}`);
  return dl.downloader({
    dbx,
    local: tmpFile,
    remote: item,
    mode: 0o600,
    inactivityTimeout,
    limiter,
  });
};

const localMediaInfoOnFile = async (file: string): Promise<MediainfoData> => {
  console.log(`Running mediainfo on ${file}`);

  const r = await promisify(execFile)("mediainfo", [
    "--full",
    "--output=JSON",
    file,
  ]);

  if (r.stderr !== "")
    throw new Error(`mediainfo produced stderr: ${r.stderr}`);

  return JSON.parse(r.stdout) as MediainfoData;
};

const unlinkTmpFile = (path: string): Promise<void> => {
  console.log(`Unlinking ${path}`);

  return unlink(path).catch((err) => {
    if (err instanceof Error && "code" in err && err.code === "ENOENT") return;

    throw err;
  });
};

const nullLimiter = <T>(): PromiseLimiter<T> => ({
  submit: (task: () => Promise<T>) => task(),
});

export const localFetcher = (
  dbx: Dropbox,
  limiter: PromiseLimiter<MediainfoData>,
  _globalOptions: GlobalOptions,
  timeoutMillis = 1800000,
): Fetcher => ({
  fetch: async (item: FileMetadata): Promise<MediainfoData> =>
    limiter.submit(
      () =>
        generateTmpFileName(item.rev).then((tmpFile) =>
          downloadToFile(dbx, item, tmpFile, timeoutMillis, nullLimiter())
            .then(() => localMediaInfoOnFile(tmpFile))
            .finally(() => void unlinkTmpFile(tmpFile)),
        ),
      `mediainfo-local-${item.path_lower}`,
    ),
});
