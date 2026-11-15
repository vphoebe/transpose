import type { TransposeResult } from "./types";

interface ITunesResponse {
  resultCount: number;
  results: ITunesResult[];
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
type ITunesLookupResponse = ITunesResponse;

export type ITunesEntityType = "album" | "musicArtist" | "song";
export const ALLOWED_ITUNES_ENTITY_TYPES = ["album", "musicArtist", "song"];

function parseResult(item: ITunesResult | null): TransposeResult | null {
  if (!item) return null;
  const base = {
    service: "itunes",
    type: item.wrapperType,
    artistName: item.artistName,
  };

  switch (item.wrapperType) {
    case "artist":
      return {
        ...base,
        url: item.artistLinkUrl,
      };
    case "collection":
      return {
        ...base,
        url: item.collectionViewUrl,
        collectionName: item.collectionName,
      };
    case "track":
      return {
        ...base,
        url: item.trackViewUrl,
        collectionName: item.collectionName,
        trackName: item.trackName,
      };
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
  const url =
    `https://itunes.apple.com/search` +
    `?term=${encodeURIComponent(query)}` +
    `&media=music&entity=${encodeURIComponent(type)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Upstream iTunes error.");
  }
  const data = await response.json<ITunesLookupResponse>();
  const item = data.results[0];
  return parseResult(item);
}
