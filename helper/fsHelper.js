const fs = require('fs');


const renameImageAndGetDbName = (postNumber, file) => {
    let ogName = file.originalname;
    let extension = ogName.substring(ogName.lastIndexOf("."));
    const newUrl = file.destination + '/' + postNumber + extension;

    fs.renameSync(file.path, newUrl);
    return postNumber + extension;
}

module.exports = {
    renameImageAndGetDbName
}