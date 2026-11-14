function resolveServiceFromUrl(url: URL) {
  if (
    url.hostname === "music.apple.com" ||
    url.hostname === "itunes.apple.com"
  ) {
    return "apple-music";
  }
  return null;
}

export function resolveIdFromUrl(url: URL) {
  const service = resolveServiceFromUrl(url);
  if (service === "apple-music") {
    const definiteId = url.searchParams.get("i");
    const trailingIdMatch = url.pathname.match(/\d+$/);
    return {
      service,
      id: definiteId || (trailingIdMatch?.[0] ?? null),
    };
  } else {
    return null;
  }
}
