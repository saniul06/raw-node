const utilities = require('../../helpers/utilities')

const data = require('../../lib/data'); 

const path = require('path');
// const { request } = require('http');
// const { parse } = require('path');

const handler = {}; 

handler._token = {};

handler.method = ['get', 'post', 'put', 'delete']; 

handler.tokenHandler = (requestObject, callback) => {
    if (handler.method.includes(requestObject.method)) {
        handler._token[requestObject.method](requestObject, callback)
    } else {
        callback(405, {
            message: "Your method is not accepted",
        });
    }
};

handler._token.post = (requestObject, callback) => {
    const parsedData = utilities.parseJson(requestObject.body)
    if (parsedData) {
        const mobile = typeof parsedData.mobile === 'string' && parsedData.mobile.trim().length == 11 ? parsedData.mobile : false;
        const password = parsedData.password.trim().length > 0 ? parsedData.password : false;
        if (mobile && password) {
            data.read('users', mobile, (err, userData) => {
                if (!err) {
                    if (utilities.hash(password) === userData.password) {
                        const token = utilities.randomString(20);
                        const expires = Date.now() + 60 * 60 * 1000;
                        let obj = {
                            mobile,
                            token,
                            expires
                        };
                        data.create('tokens', token, obj, err => {
                            if (!err) {
                                callback(200, {
                                    Message: "Token Created Successfully"
                                })
                            } else {
                                callback(500, {
                                    err
                                })
                            }
                        })
                    } else {
                        callback(500, {
                            Error: "You Have Entered Wrong Password"
                        })
                    }
                } else {
                    callback(500, {
                        Error: 'You Are Not Registered.Please Sign Up First'
                    })
                }
            })
        } else {
            callback(400, {
                Error: "Please Enter Valid Mobile"
            })
        }

    } else {
        callback(400, {
            Error: "Please Enter Valid JSON Data"
        })
    }


}

handler._token.get = (requestObject, callback) => {
    data.read('tokens', requestObject.queryObject.token, (err, message) => {
        if (!err) {
            callback(200, message)
        } else {
            callback(404, {
                message: "you Have Entered Wrong Token"
            })
        }
    })
}

handler._token.put = (requestObject, callback) => {
    const parsedData = utilities.parseJson(requestObject.body)
    if (parsedData) {
        const token = parsedData.token.trim().length == 20 ? parsedData.token : false;
        const extend = parsedData.extend === true ? parsedData.extend : false;
        if (token && extend) {
            data.read('tokens', token, (err, tokenBody) => {
                if (!err) {
                    if (tokenBody.expires > Date.now()) {
                        tokenBody.expires = Date.now() + 60 * 60 * 1000
                        data.update('tokens', token, tokenBody, (err, message) => {
                            if (!err) {
                                callback(200, {
                                    Message: 'Token Updated Successfully'
                                })
                            } else {
                                callback(500, {
                                    message
                                })
                            }
                        })
                    } else {
                        callback(500, {
                            Error: "Your token already expired"
                        })
                    }

                } else {
                    callback(500, {
                        Error: "Token Not Found"
                    })
                }
            })
        } else {
            callback(400, {
                Error: "Please Enter Valid Data"
            })
        }
    } else {
        callback(405, {
            Error: "Please Enter Valid JSON"
        })
    }
}

handler._token.delete = (requestObject, callback) => {
    const fileName = requestObject.queryObject.token;
    data.delete('tokens', fileName, (err, message) => {
        if (!err) {
            callback(200, {
                Message: "Token deleted Successfully"
            })
        } else {
            callback(500, {
                message
            })
        }
    })
}

handler.tokenVerify = (token, phone, callback) => {
    data.read('tokens', token, (err, tokenBody) => {
        if (!err) {
            if (tokenBody.mobile === phone) {
                if (tokenBody.expires > Date.now()) {
                    callback(false, 'successfull', 200)
                } else {
                    callback(true, "Token already expired", 403)
                }
            } else {
                callback(true, "Phone number doesn't match", 500)
            }
        } else {
            callback(true, "Can not find token", 404)
        }
    })
}

module.exports = handler;
