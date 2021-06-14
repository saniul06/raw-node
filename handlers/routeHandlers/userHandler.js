const utilities = require('../../helpers/utilities')
    
const data = require('../../lib/data'); 

const tokenHandler = require('./tokenHandler');

const path = require('path');
// const { request } = require('http');
// const { parse } = require('path');
// const { token } = require('../../route');

const handler = {}; 

handler._user = {};

handler.method = ['get', 'post', 'put', 'delete'];

handler.userHandler = (requestObject, callback) => {
    if (handler.method.includes(requestObject.method)) {
        handler._user[requestObject.method](requestObject, callback)
    } else {
        callback(405, {
            message: "Your method is not accepted",
        });
    }
};

handler._user.post = (requestObject, callback) => {
    const parsedData = utilities.parseJson(requestObject.body)
    if (parsedData) {
        const validedData = utilities.validation(parsedData);
        if (validedData.success) {
            data.create('users', parsedData.mobile, validedData.data, err => {
                if (!err) {
                    callback(200, {
                        message: 'file created Successfully'
                    })
                } else {
                    callback(500, {
                        Error: err
                    })
                }
            })
        } else {
            callback(400, {
                Error: "Your Data is not Valid"
            })
        }
    } else {
        callback(400, {
            Error: "Enter Valid JSON Data"
        })
    }
}

handler._user.get = (requestObject, callback) => {
    const token = requestObject.headerObject.token.length === 20 ? requestObject.headerObject.token : false;
    if (token) {
        tokenHandler.tokenVerify(token, requestObject.queryObject.mobile, (err, message) => {
            if (!err) {
                data.read('users', requestObject.queryObject.mobile, (err, message) => {
                    if (!err) {
                        delete message.password;
                        callback(200, message)
                    } else {
                        callback(404, {
                            message
                        })
                    }
                })
            } else {
                callback(500, {
                    message
                })
            }
        })
    } else {
        callback(404, {
            Error: "Enter a Valid Token"
        })
    }
}

handler._user.put = (requestObject, callback) => {
    const parsedData = utilities.parseJson(requestObject.body);
    if (parsedData) {
        tokenHandler.tokenVerify(requestObject.headerObject.token, parsedData.mobile, (err, message, statusCode) => {
            if (!err) {
                const fileName = parsedData.mobile;
                data.read('users', fileName, (err, body) => {
                    if (!err) {
                        if (parsedData.firstName) {
                            body.firstName = parsedData.firstName;
                        }
                        if (parsedData.lastName) {
                            body.lastName = parsedData.lastName;
                        }
                        if (parsedData.password) {
                            body.password = utilities.hash(parsedData.password);
                        }
                        data.update('users', fileName, body, (err, message) => {
                            if (!err) {
                                callback(200, {
                                    Message: "User Updated Successfully"
                                })
                            } else {
                                callback(500, {
                                    message
                                })
                            }
                        })
                    } else {
                        callback(404, {
                            Error: "Token doesn't Exists"
                        })
                    }
                })

            } else {
                callback(statusCode, {
                    Error: message
                })
            }
        })
    } else {
        callback(500, {
            Error: "Can not parse data.Enter Valid JSON"
        })
    }
}

handler._user.delete = (requestObject, callback) => {
    const parsedData = utilities.parseJson(requestObject.body)
    if (parsedData) {
        tokenHandler.tokenVerify(requestObject.headerObject.token, parsedData.mobile, (err, msg, statusCode) => {
            if (!err) {
                const fileName = parsedData.mobile;
                data.delete('users', fileName, (err1, message) => {
                    if (!err1) {
                        callback(200, {
                            message
                        })
                    } else {
                        callback(500, {
                            message
                        })
                    }
                })
            } else {
                callback(statusCode, {
                    Error: msg
                })
            }
        })
    } else {
        callback(400, {
            Error: "Please Enter Valid JSON"
        })
    }
}

module.exports = handler;
