import type { Response } from "express";

export const sendSuccess = (res: Response, data: any, message = "OK") => {
    res.status(200).json({
        success: true,
        message,
        data,
    });
};