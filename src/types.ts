// export class MediainfoData {
//   private readonly data: unknown;

//   constructor(jsonData: unknown) {
//     this.data = jsonData;
//   }

//   get jsonData(): unknown {
//     return this.data;
//   }
// }

export const StringyNonNegativeIntegerTag = Symbol("StringyNonNegativeInteger");
export type StringyNonNegativeInteger = string & {
  readonly [StringyNonNegativeIntegerTag]: true;
};

export type CreatingLibrary = {
  name: string;
  url: string;
  version: string;
};

export interface GeneralTrack extends Track {
  "@type": "General";
  DataSize: StringyNonNegativeInteger;
}

export interface VideoTrack extends Track {
  "@type": "Video";
}

export interface AudioTrack extends Track {
  "@type": "Audio";
}

export interface Track {
  "@type": string;
}

export type Media = {
  "@ref": string;
  track: Track[];
};

export type MediainfoData = {
  creatingLibrary: CreatingLibrary;
  media: Media | null;
};
