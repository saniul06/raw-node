const handler = {};

handler.aboutHandler = (requestObject, callback) => {
    // console.log(requestObject)
    callback(200, {
        message: "i am about route",
    });
};

module.exports = handler;
 