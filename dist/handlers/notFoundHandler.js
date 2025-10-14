export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
    });
};
//# sourceMappingURL=notFoundHandler.js.map