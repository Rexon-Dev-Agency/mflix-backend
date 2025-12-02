import { getMovieDetails, getTvDetails, searchMovies } from '../utils/movie.js';
import { errorHandler } from '../handlers/errorHandlers.js';
import { sendSuccess } from '../handlers/responseHandler.js';
export const fetchMovie = async (req, res) => {
    try {
        const movieId = parseInt(req.params.id ?? '0');
        if (!movieId || movieId <= 0) {
            return res.status(400).json({ error: 'Invalid movie ID' });
        }
        const movie = await getMovieDetails(movieId);
        sendSuccess(res, movie, 'Movie details fetched successfully');
    }
    catch (err) {
        console.error("Fetch Movie Error:", err.message || err);
        errorHandler({ status: 500, message: 'Failed to fetch movie details' }, req, res, () => { });
    }
};
export const fetchTvEpisode = async (req, res) => {
    try {
        const tvId = parseInt(req.params.tvId ?? '0');
        const season = parseInt(req.params.season ?? '0');
        const episode = parseInt(req.params.episode ?? '0');
        if (!tvId || tvId <= 0 || !season || season <= 0 || !episode || episode <= 0) {
            return res.status(400).json({ error: 'Invalid TV ID, season, or episode number' });
        }
        const episodeDetails = await getTvDetails(tvId, season, episode);
        sendSuccess(res, episodeDetails, 'TV episode details fetched successfully');
    }
    catch (err) {
        console.error("Fetch TV Episode Error:", err.message || err);
        errorHandler({ status: 500, message: 'Failed to fetch TV episode details' }, req, res, () => { });
    }
};
export const searchForMovies = async (req, res) => {
    try {
        const query = req.query.q;
        if (!query || query.trim() === '') {
            return res.status(400).json({ error: 'Search query cannot be empty' });
        }
        const results = await searchMovies(query);
        sendSuccess(res, results, 'Search results fetched successfully');
    }
    catch (err) {
        console.error("Search For Movies Error:", err.message || err);
        errorHandler({ status: 500, message: 'Failed to fetch search results' }, req, res, () => { });
    }
};
//# sourceMappingURL=movieContoller.js.map