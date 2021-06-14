const urlll = require("url");

const route = require('../route')

const { StringDecoder } = require("string_decoder");

const environment = require('./environment');

const utilities = require('./utilities')

const { indexHandler } = require("../handlers/routeHandlers/indexHandler");
// const { request } = require("http");

const handler = {};

handler.handleReqRes = (req, res) => {
    parsedUrl = urlll.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimedPath = path.replace(/^\/|\/$/g, "");
    const headerObject = req.headers;
    const method = req.method.toLowerCase();
    const queryObject = parsedUrl.query
    const requestObject = {
        headerObject,
        method,
        queryObject
    };
    var chosenHandler = route[trimedPath] ? route[trimedPath] : route["notFoundHandler"];
    if (trimedPath == '')
        chosenHandler = route['home'];

    const stringDecoder = new StringDecoder("utf-8");

    let payLoad = "";

    req.on("data", (buffer) => {
        payLoad += stringDecoder.write(buffer);
    });

    req.on("end", () => {
        payLoad += stringDecoder.end();
        requestObject.body = payLoad;
        chosenHandler(requestObject, (status, data) => {
            const statusCode = typeof (status) === 'number' ? status : 500;
            let payloadBody = typeof (data) === 'object' ? JSON.stringify(data) : data;
            res.setHeader("Content-Type", "application/json")
            res.writeHead(statusCode)
            // res.end(environment.envName)
            // try{
            //     let p = JSON.parse(payLoad)
            // } catch(e) {
            //     console.log(e)
            // }
            res.end(payloadBody)
        })
    });
};

module.exports = handler; 