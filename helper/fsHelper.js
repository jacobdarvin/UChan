const fs = require('fs');


const renameImageAndGetDbName = (id, file) => {
    let ogName = file.originalname;
    let extension = ogName.substring(ogName.lastIndexOf("."));
    const newUrl = file.destination + '/' + id + extension;

    fs.renameSync(file.path, newUrl);
    return id + extension;
}

module.exports = {
    renameImageAndGetDbName
}