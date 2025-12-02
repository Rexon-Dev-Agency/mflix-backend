export const fetchStreamUrl = async (movieId: number, meta: { type: "movie" | "tv"; season?: number; episode?: number }): Promise<string> => {
    if (meta.type === "movie") {
    // Movie URL
    return `https://player.autoembed.cc/embed/movie/${movieId}`;
  } else if (meta.type === "tv") {
    if (!meta.season || !meta.episode) {
      throw new Error("TV shows require season and episode numbers");
    }
    // TV show URL
    return `https://player.autoembed.cc/embed/tv/${movieId}/${meta.season}/${meta.episode}`;
  } else {
    throw new Error("Invalid content type");
  }
};