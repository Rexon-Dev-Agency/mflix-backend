import { apiClient } from "./apiClient.js";
import { API_KEY_TMDB } from "../env.js";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const config = {
    method: "GET",
    headers: {
        "Content-Type": "application/json",
    },
    params: {
        api_key: API_KEY_TMDB,
    },
};
export const getMovieDetails = async (movieId) => {
    try {
        const url = `${TMDB_BASE_URL}/movie/${movieId}?append_to_response=videos, credits`;
        const response = await apiClient(url, config);
        return response;
    }
    catch (err) {
        console.error("Get Movie Details Error:", err.message || err);
        throw err;
    }
};
export const getTvDetails = async (tvId, season, episode) => {
    try {
        const url = `${TMDB_BASE_URL}/tv/${tvId}/season/${season}/episode/${episode}`;
        const response = await apiClient(url, config);
        return response;
    }
    catch (err) {
        console.error("Get TV Details Error:", err.message || err);
        throw err;
    }
};
export const searchMovies = async (query) => {
    try {
        const url = `${TMDB_BASE_URL}/search/multi`;
        const searchConfig = {
            ...config,
            params: {
                ...config.params,
                query: query,
            },
        };
        const response = await apiClient(url, searchConfig);
        return response;
    }
    catch (err) {
        console.error("Search Movies Error:", err.message || err);
        throw err;
    }
};
//# sourceMappingURL=movie.js.map