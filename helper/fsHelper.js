const fs = require('fs');


const renameImageAndGetDbName = (id, file) => {
    let ogName = file.originalname;
    let extension = ogName.substring(ogName.lastIndexOf("."));
    const newUrl = file.destination + '/' + id + extension;

    fs.renameSync(file.path, newUrl);
    return id + extension;
}

const deletePostImage = async function(imagename) {
    if (imagename === 'undefined' || imagename === "" || imagename === undefined) {
        return;
    }
    fs.unlink('./public/postimgs/' + imagename, error => {
        if (error) {
            console.log(error);
        }
    });
}

module.exports = {
    renameImageAndGetDbName,
    deletePostImage
}