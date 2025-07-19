export type ContentHash = string;

export type MediainfoFromHash = {
  mediainfoData: MediainfoData;
  addedAt: Date;
  firstSeenFilename: string;
};

export type MediainfoFromHashSerializable = {
  mediainfoData: MediainfoData;
  addedAt: string;
  firstSeenFilename: string;
};

export const StringyNonNegativeIntegerTag = Symbol("StringyNonNegativeInteger");
export type StringyNonNegativeInteger = string & {
  readonly [StringyNonNegativeIntegerTag]: true;
};

export const StringyNonNegativeFloatTag = Symbol("StringyNonNegativeFloat");
export type StringyNonNegativeFloat = string & {
  readonly [StringyNonNegativeFloatTag]: true;
};

export type CreatingLibrary = {
  readonly name: string;
  readonly url: string;
  readonly version: string;
};

export interface Track {
  readonly "@type": string;
  readonly CodecID: string;
  readonly Count: StringyNonNegativeInteger;
  readonly Format: string;
  readonly StreamKind: string;
  readonly StreamCount: StringyNonNegativeInteger;
}

export interface GeneralTrack extends Track {
  readonly "@type": "General";
  readonly CompleteName: string;
  readonly FileName: string;
  readonly FileNameExtension: string;
  readonly FileSize: StringyNonNegativeInteger;
  readonly FolderName: string;
  readonly DataSize: StringyNonNegativeInteger; // only in General
  readonly Duration: StringyNonNegativeFloat;
  readonly StreamSize: StringyNonNegativeInteger;
  readonly Recorded_Location: string;
}

export interface VideoTrack extends Track {
  readonly "@type": "Video";
  readonly Duration: StringyNonNegativeFloat;
  readonly StreamSize: StringyNonNegativeInteger;
  readonly Width: StringyNonNegativeInteger;
  readonly Height: StringyNonNegativeInteger;
  readonly Rotation: string;
  readonly PixelAspectRatio: StringyNonNegativeFloat;
  readonly DisplayAspectRatio: StringyNonNegativeFloat;
  readonly DisplayAspectRatio_String: string; // e.g. "16:9"
  readonly InternetMediaType: string;
  readonly FrameRate: StringyNonNegativeFloat;
  readonly FrameRate_Mode: string;
  readonly FrameCount: StringyNonNegativeInteger;
  readonly ColorSpace: string;
  readonly BitDepth: string;
  readonly ScanType: string;
}

export interface AudioTrack extends Track {
  readonly "@type": "Audio";
  readonly Duration: StringyNonNegativeFloat;
  readonly StreamSize: StringyNonNegativeInteger;
  readonly BitRate_Mode: string;
  readonly BitRate: StringyNonNegativeFloat;
  readonly Channels: StringyNonNegativeInteger;
  readonly SamplingRate: StringyNonNegativeFloat;
  readonly Compression_Mode: string;
  readonly Source_Duration: StringyNonNegativeFloat;
  readonly Source_StreamSize: StringyNonNegativeInteger;
}

export interface OtherTrack extends Track {
  readonly "@type": "Other";
  readonly Duration: StringyNonNegativeFloat;
  readonly StreamSize: StringyNonNegativeInteger;
  readonly BitRate_Mode: string;
  readonly FrameCount: StringyNonNegativeInteger;
  readonly Type: string;
}

// Also, rarely: "Image", "Menu"

export type Media = {
  readonly "@ref": string;
  readonly track: Track[];
};

export type MediainfoData = {
  readonly creatingLibrary: CreatingLibrary;
  readonly media: Media | null;
};

// Also, rarely: "Image", "Menu"
export const isGeneralTrack = (track: Track): track is GeneralTrack =>
  track["@type"] === "General";
export const isVideoTrack = (track: Track): track is VideoTrack =>
  track["@type"] === "Video";
export const isAudioTrack = (track: Track): track is AudioTrack =>
  track["@type"] === "Audio";
export const isOtherTrack = (track: Track): track is OtherTrack =>
  track["@type"] === "Other";
