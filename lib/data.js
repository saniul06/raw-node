const fs = require('fs');

const path = require('path');

const utilities = require('../helpers/utilities')

const lib = {};

lib.baseDir = path.join(__dirname, '../.data');

lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            const stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, (err1, f1) => {
                if (!err1) {
                    fs.close(fileDescriptor, (err2, f22) => {
                        if (!err2 && fileDescriptor) {
                            callback(false)
                        } else {
                            callback("error closing the new file")
                        }
                    })
                } else {
                    callback("Error Writing the new file")
                }
            })
        } else {
            callback('error occured, File already exists')
        }
    })
}

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.baseDir}/${dir}/${file}.json`, 'utf8', (err, data) => {
        if (!err) {
            // let obj = JSON.parse(data)
            let obj = utilities.parseJson(data)
            if (obj) {
                callback(false, obj)
            } else {
                callback(true, "Can not found data in desired file")
            }
        } else {
            callback(true, "Can not read file.Maybe it doesn't exists");
        }
    })
}

// lib.update = (dir, file, data, callback) => {
//     fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fd) => {
//         if (!err) {
//             const stringData = JSON.stringify(data);
//             // fs.ftruncate(fd, err1 => {
//                 // if (!err1) {
//                     fs.writeFile(fd, stringData, err2 => {
//                         if (!err2) {
//                             fs.close(fd, err3 => {
//                                 if (!err3) {
//                                     callback(false)
//                                } else {
//                                     callback('Error when closing file in update')
//                                 }
//                             })
//                         } else {

//                         }
//                     })
//                 // } else {
//                 //     callback('Error when truncating file')
//                 // }
//             // })
//         } else {
//             callback("Error opening file")
//         }
//     })
// }

lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.baseDir}/${dir}/${file}.json`, 'r+', (err, fd) => {
        if (!err) {
            const stringData = JSON.stringify(data);
            fs.ftruncate(fd, err1 => {
                if (!err1) {
                    fs.writeFile(fd, stringData, err2 => {
                        if (!err2) {
                            fs.close(fd, err3 => {
                                if (!err3) {
                                    callback(false, "File Updated Successfully")
                                } else {
                                    callback(true, 'Error when closing file in update')
                                }
                            })
                        } else {

                        }
                    })
                } else {
                    callback(true, 'Error when truncating file')
                }
            })
        } else {
            callback(true, "File doesn't exists.Please cerate first")
        }
    })
}

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.baseDir}/${dir}/${file}.json`, err => {
        if (!err) {
            callback(false, "User Deleted Successfully")
        } else {
            callback(true, 'Error Deleting User.Maybe Users Doesn\'t exists');
        }
    })
}

lib.list = (dir, callback) => {
    fs.readdir(`${lib.baseDir}/${dir}`, (err1, filenNames) => {
        if (!err1 && filenNames.length > 0) {
            console.log('filenNames', filenNames)
            const fileNameList = filenNames.map(file => {
                return file.replace('.json', '')
            })
            callback(false, fileNameList)
            console.log('New fileNames', fileNameList)
        } else {
            callback(true, "Folder not found")
        }
    })
}

module.exports = lib;