const handler = {};

handler.notFoundHandler = (request, callback) => {
    callback(500, {
        message: "Route is not found",
    });
};

module.exports = handler;
