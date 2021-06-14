const http = require("http");

const environment = require('./helpers/environment')

const { handleReqRes } = require("./helpers/handleReqRes");

const data = require('./lib/data')

const {sendTwilioSms} = require('./helpers/notification')

// sendTwilioSms('01535524791', 'this is a msg', err => {
//     console.log('this is the error::: ', err);
// });

// data.create('test', 'sample', { name: 'saniul', age: 32 }, (show) => {
//     console.log("create error: ", show)
// })

// data.update('test', 'sample', {name: 'bangladesh', language: 'bangla'}, (err, data) => {
//     console.log("update error: ", err)
// })

// data.read('test', 'sample', (err, data) => {
//     console.log("read error: ", err, "read data in read: ", data)
// })

// data.delete('test', 'sample', err => {
//     console.log('In Delete: ', err)
// })

const app = {};

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`yes i am starting at port ${environment.port}`);
    });
};

app.handleReqRes = handleReqRes;

app.createServer();

data.list('users', (err) => {
    console.log(err)
})
