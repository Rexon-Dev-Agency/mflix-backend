export const sendSuccess = (res, data, message = "OK") => {
    res.status(200).json({
        success: true,
        message,
        data,
    });
};
//# sourceMappingURL=responseHandler.js.map