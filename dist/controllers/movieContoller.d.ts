import type { Request, Response } from 'express';
export declare const fetchMovie: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const fetchTvEpisode: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const searchForMovies: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=movieContoller.d.ts.map