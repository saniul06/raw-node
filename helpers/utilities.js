const crypto = require('crypto');

const environment = require('./environment');

const handler = {};

handler.parseJson = data => {
    let output;
    try {
        output = JSON.parse(data)
        return output;
    } catch {
        return false;
    }
}

handler.hash = password => {
    const passw = crypto.createHmac('sha256', environment.secretKey)
        .update(password)
        .digest('hex');
    return passw;
}

handler.validation = (parsedData) => {
    const firstName = typeof parsedData.firstName === 'string' && parsedData.firstName.trim().length > 0 ? parsedData.firstName : false;
    const lastName = typeof parsedData.lastName === 'string' && parsedData.lastName.trim().length > 0 ? parsedData.lastName : false;
    const mobile = typeof parsedData.mobile === 'string' && parsedData.mobile.trim().length == 11 ? parsedData.mobile : false;
    const password = typeof parsedData.password === 'string' && parsedData.password.trim().length > 0 ? handler.hash(parsedData.password) : false;
    const tos = typeof parsedData.tos === 'boolean' ? parsedData.tos : false;
    const o = {
        firstName,
        lastName,
        mobile,
        password,
        tos
    }
    if (firstName && lastName && mobile && password && tos) {
        const validedData = {};
        validedData.data = o;
        validedData.success = true;
        return validedData;
    }
    else {
        const validedData = {};
        validedData.data = o;
        validedData.success = false;
        return validedData;
    }
}

handler.randomString = (length) => {
    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    let random = '';
    for (let i = 0; i < length; i++) {
        random += str.charAt(Math.floor(Math.random() * 62))
    }
    return random;
}

module.exports = handler;