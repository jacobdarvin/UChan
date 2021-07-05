/*
* Module that deal deals with files, images, and the like.
*/
//======================================================================
// Imports
//======================================================================

const fs = require('fs-extra');

//======================================================================
// Exports
//======================================================================

/**
 * Renames an image to <id of poster> + <extension>
 * 
 * @param {string} id the post id to be used as the database name for the file.
 * @param {FormData} file the file to rename 
 * 
 */
//TODO: rethink this - design change involving using the actual name to be saved in the db
const renameImageAndGetDbName = (id, file) => {
    let ogName = file.originalname;
    let extension = ogName.substring(ogName.lastIndexOf("."));
    const newUrl = file.destination + '/' + id + extension;

    fs.renameSync(file.path, newUrl);
    return id + extension;
}

/**
 * Delete's the image of a post.
 * @async
 * 
 * @param {string} imagename the image name to look for and delete.
 * @returns 
 */
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
/** 
 * Creates a copy of an image belonging to a post that has been reported. The copies
 * are saved into a separate admin folder. 
 * 
 * @param {string} imagename the image to make a moderator copy of.
 * @returns 
 */
//TODO: restrict access to reported images if not moderator
const makeReportCopy = async(imagename) => {
    if (imagename === 'undefined' || imagename === "" || imagename === undefined) {
        return;
    }

    fs.copyFile('./public/postimgs/' + imagename, './admin/reportedimgs/' + imagename, error => {
        if (error) {
            console.log(error);
        }
    });
}
module.exports = {
    renameImageAndGetDbName,
    deletePostImage,
    makeReportCopy,
    fs
}