const utilities = require('../../helpers/utilities')

const data = require('../../lib/data');

const tokenHandler = require('./tokenHandler');

const path = require('path');
const { request } = require('http');

const handler = {};

handler._user = {};

handler.method = ['get', 'post', 'put', 'delete'];

handler.checkHandler = (requestObject, callback) => {
    if (handler.method.includes(requestObject.method)) {
        handler._user[requestObject.method](requestObject, callback)
    } else {
        callback(405, {
            message: "Your method is not accepted",
        });
    }
};

handler._user.post = (requestObject, callback) => {

    const parsedBody = utilities.parseJson(requestObject.body)
    if (parsedBody) {
        const protocol = typeof parsedBody.protocol === 'string' && parsedBody.protocol.trim().length > 0 ? parsedBody.protocol.trim() : false;

        const url = typeof parsedBody.url === 'string' && parsedBody.url.trim().length > 0 ? parsedBody.url : false;

        const method = typeof parsedBody.method === 'string' && handler.method.indexOf(parsedBody.method) > -1 ? parsedBody.method : false;

        const successCode = parsedBody.successCode instanceof Array && parsedBody.successCode.length > 0 ? parsedBody.successCode : false;

        const timeoutSeconds = typeof parsedBody.timeoutSeconds === 'number' && parsedBody.timeoutSeconds > 0 && parsedBody.timeoutSeconds < 6 ? parsedBody.timeoutSeconds : false;

        if (protocol && url && method && successCode && timeoutSeconds) {
            const token = requestObject.headerObject.token;
            data.read('tokens', token, (err, tokenBody) => {
                if (!err) {
                    const mobile = tokenBody.mobile;
                    data.read('users', mobile, (err1, userBody) => {
                        if (!err1) {
                            tokenHandler.tokenVerify(token, mobile, (err, message, statusCode) => {
                                if (!err) {
                                    const checks = userBody.checks instanceof Array ? userBody.checks : [];
                                    if (checks.length < 5) {
                                        const checkId = utilities.randomString(20);
                                        checks.push(checkId);
                                        userBody.checks = checks;
                                        const checkObj = {
                                            id: checkId,
                                            mobile,
                                            protocol,
                                            url,
                                            method,
                                            successCode,
                                            timeoutSeconds
                                        };
                                        data.create('checks', checkId, checkObj, err3 => {
                                            if (!err3) {
                                                data.update('users', mobile, userBody, (err4, message) => {
                                                    callback(200, {
                                                        Message: 'Check added & User updated Successfully'
                                                    })
                                                })
                                            } else {
                                                Error: "Cann't Create New Check"
                                            }
                                        })
                                    } else {
                                        callback(405, {
                                            Error: "You have already added 5 checks"
                                        })
                                    }
                                } else {
                                    callback(statusCode, {
                                        message
                                    })
                                }
                            })
                        } else {
                            callback(500, {
                                Error: "Cann't find user"
                            })
                        }
                    })
                } else {
                    callback(500, {
                        Error: "Token not Found"
                    })
                }
            })



        } else {
            callback(405, {
                Error: "Please insert valid input"
            })
        }


    } else {
        callback(400, {
            Error: "Please enter valid JSON"
        })
    }
}

handler._user.get = (requestObject, callback) => {
    const parsedBody = utilities.parseJson(requestObject.body);
    if (parsedBody) {
        const id = typeof requestObject.queryObject.id === 'string' && requestObject.queryObject.id.trim().length > 0 ? requestObject.queryObject.id : false;
        data.read('checks', id, (err1, checkBody) => {
            if (!err1) {
                const mobile = checkBody.mobile;
                const token = requestObject.headerObject.token;
                data.read('tokens', token, (err2, tokenBody) => {
                    if (!err2) {
                        tokenHandler.tokenVerify(token, mobile, (err3, message, statusCode) => {
                            if (!err3) {
                                callback(200, {
                                    checkBody
                                })
                            } else {
                                callback(statusCode, {
                                    Error: message
                                });
                            }
                        })
                    } else {
                        callback(400, {
                            Error: "Token not Found"
                        })
                    }
                })
            } else {
                callback(404, {
                    Error: "Check id Not Found"
                });
            }
        })
    } else {
        callback(400, {
            Error: "Please enter valid JSON"
        });
    }
}

handler._user.put = (requestObject, callback) => {
    const parsedBody = utilities.parseJson(requestObject.body)
    if (parsedBody) {
        const id = typeof parsedBody.id === 'string' && parsedBody.id.trim().length > 0 ? parsedBody.id : false;
        if (id) {
            data.read('checks', id, (err1, checkBody) => {
                if (!err1) {
                    const mobile = checkBody.mobile;
                    const token = requestObject.headerObject.token;
                    tokenHandler.tokenVerify(token, mobile, (err2, message, statusCode) => {
                        if (!err2) {
                            const protocol = typeof parsedBody.protocol === 'string' && parsedBody.protocol.trim().length > 0 ? parsedBody.protocol.trim() : false;

                            const url = typeof parsedBody.url === 'string' && parsedBody.url.trim().length > 0 ? parsedBody.url : false;

                            const method = typeof parsedBody.method === 'string' && handler.method.indexOf(parsedBody.method) > -1 ? parsedBody.method : false;

                            const successCode = parsedBody.successCode instanceof Array && parsedBody.successCode.length > 0 ? parsedBody.successCode : false;

                            const timeoutSeconds = typeof parsedBody.timeoutSeconds === 'number' && parsedBody.timeoutSeconds > 0 && parsedBody.timeoutSeconds < 6 ? parsedBody.timeoutSeconds : false;

                            if (protocol || url || method || successCode || timeoutSeconds) {
                                checkBody.protocol = protocol ? protocol : checkBody.protocol;
                                checkBody.url = url ? url : checkBody.url;
                                checkBody.method = method ? method : checkBody.method;
                                checkBody.successCode = successCode ? successCode : checkBody.successCode;
                                checkBody.timeoutSeconds = timeoutSeconds ? timeoutSeconds : checkBody.timeoutSeconds;
                                data.update('checks', id, checkBody, (err3, message) => {
                                    if (!err3) {
                                        callback(200, {
                                            Message: "Check Updated Successfully"
                                        });
                                    } else {
                                        callback(500, {
                                            message
                                        });
                                    }
                                })
                            } else {
                                callback(400, {
                                    Error: "You Must Have Provide Atleast One Field"
                                })
                            }
                        } else {
                            callback(statusCode, {
                                message
                            })
                        }

                    })
                } else {
                    callback(500, {
                        Error: "Check Id doesn't Exists"
                    })
                }
            })
        } else {
            callback(400, {
                Error: "Check Id is not Valid"
            })
        }
    } else {
        callback(400, {
            Error: "Please Enter a Valid JSON"
        })
    }

}

handler._user.delete = (requestObject, callback) => {
    const id = typeof requestObject.queryObject.id === "string" && requestObject.queryObject.id.trim().length > 0 ?
    requestObject.queryObject.id : false;
    if(id){
        data.read('checks', id, (err1, checkBody) => {
            if(!err1){
                const mobile = checkBody.mobile;
                tokenHandler.tokenVerify(requestObject.headerObject.token, mobile, (err2, message, statusCode) => {
                    if(!err2){
                        data.delete('checks', id, (err3) => {
                            if(!err3){
                                data.read('users', mobile, (err4, userBody) => {
                                    if(!err4){
                                        const checks = typeof userBody.checks === "object" && userBody.checks instanceof Array ? userBody.checks : false;
                                        if(checks){
                                            const position = checks.indexOf(id)
                                            if(position > -1){
                                                checks.splice(position, 1)
                                                data.update('users', mobile, userBody, (err4) => {
                                                    if(!err4){
                                                        callback(200, {
                                                            Message: "Checks deleted & User Updated Successfully"
                                                        });
                                                    } else {
                                                        callback(500, {
                                                            Error: "Cann't Delete Check"
                                                        })
                                                    }
                                                })
                                            } else {
                                                callback(500, {
                                                    Error: "Cann't Find index for given id"
                                                })
                                            }
                                        } else {
                                            callback(405, {
                                                Error: "You have No checks yet.Add one first"
                                            })
                                        }
                                        
                                    } else {
                                        callback(404, {
                                            Error: "Cann't find User"
                                        });
                                    }
                                })
                            } else {
                                callback(500, {
                                    Error: "Check Doesn't Exists"
                                });
                            }
                        })
                    } else {
                        callback(statusCode, {
                            message
                        });
                    }
                })
            } else {
                callback(404, {
                    Error: "Check Not Found"
                })
            }
        })
    } else {
        callback(400, {
            Error: "Invalid check id"
        });
    }
}

module.exports = handler;
