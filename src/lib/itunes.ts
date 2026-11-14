import type { LookupResult } from "./types";

interface ITunesResponse<T> {
  resultCount: number;
  results: T[];
}

interface ITunesTrack {
  wrapperType: "track";
  artistName: string;
  collectionName: string;
  trackName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
  trackViewUrl: string;
}

interface ITunesCollection {
  wrapperType: "collection";
  artistName: string;
  collectionName: string;
  artistViewUrl: string;
  collectionViewUrl: string;
}

interface ITunesArtist {
  wrapperType: "artist";
  artistName: string;
  artistLinkUrl: string;
}

type ITunesResult = ITunesTrack | ITunesCollection | ITunesArtist;
type ITunesLookupResponse = ITunesResponse<ITunesResult>;

export type ITunesEntityType = "album" | "musicArtist" | "song";
export const ALLOWED_ITUNES_ENTITY_TYPES = ["album", "musicArtist", "song"];

function parseResult(item: ITunesResult | null) {
  if (!item) return null;
  const result: Partial<LookupResult> = {
    type: item.wrapperType,
    artistName: item.artistName,
  };

  switch (item.wrapperType) {
    case "artist":
      result.url = item.artistLinkUrl;
      return result as LookupResult;
    case "collection":
      result.url = item.collectionViewUrl;
      result.collectionName = item.collectionName;
      return result as LookupResult;
    case "track":
      result.url = item.trackViewUrl;
      result.collectionName = item.collectionName;
      result.trackName = item.trackName;
      return result as LookupResult;
  }
}

export async function resolveItunesId(id: string) {
  const response = await fetch(`https://itunes.apple.com/lookup?id=${id}`);
  if (!response.ok) {
    throw new Error("Upstream iTunes error.");
  }
  const data = await response.json<ITunesLookupResponse>();
  const item = data.results[0];
  return parseResult(item);
}

export async function searchItunes(query: string, type: ITunesEntityType) {
  const url = `https://itunes.apple.com/search?term=${query}&media=music&entity=${type}`;
  const response = await fetch(encodeURI(url));
  if (!response.ok) {
    throw new Error("Upstream iTunes error.");
  }
  const data = await response.json<ITunesLookupResponse>();
  const item = data.results[0];
  return parseResult(item);
}
