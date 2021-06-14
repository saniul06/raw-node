const https = require('https')

const { twilio } = require('./environment')

const qeuryString = require('querystring');
const { hostname } = require('os');
const { SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER } = require('constants');

const notification = {};

notification.sendTwilioSms = (mobile, message, callback) => {
    const phone = typeof mobile === 'string' && mobile.trim().length === 11 ? mobile.trim() : false;
    const msg = typeof message === 'string' && message.trim().length > 0 && message.trim().length <= 1600 ? message.trim() : false;
    if (phone && msg) {
        payLoad = {
            From: twilio.fromPhone,
            To: `+88${phone}`,
            Body: msg
        };
        const stringPayLoad = qeuryString.stringify(payLoad);
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'POST',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        const req = https.request(requestDetails, res => {
            const status = res.statusCode;
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback(`Status Code retured was ${status}`)
            }
        })
        req.on('error', (e) => {
            console.error(e);
            callback(e);
        });
        req.write(stringPayLoad);
        req.end();
    } else {
        callback("Pleae give valid values")
    }
}

module.exports = notification;