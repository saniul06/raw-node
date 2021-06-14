const handler = {};

handler.indexHandler = (requestObject, callback) => {
    // console.log(requestObject)
    callback(200, {
        message: "i am index route",
    });
};

module.exports = handler;
