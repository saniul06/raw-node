const { indexHandler } = require("./handlers/routeHandlers/indexHandler");
const { aboutHandler } = require("./handlers/routeHandlers/aboutHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");
const { notFoundHandler } = require("./handlers/routeHandlers/notFoundHandler");

const route = {
    home: indexHandler,
    about: aboutHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
    notFoundHandler: notFoundHandler
};

module.exports = route;
