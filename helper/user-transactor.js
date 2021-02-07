/***
 *
 *  Module that handles dtabase transactions that involve users (e.g. moderators and admins)
 *
 */

//======================================================================
// Imports
//======================================================================

const bcrypt = require('bcrypt');
const User = require('../model/user.js');
const Board = require('../model/board.js');
const RegisterKey = require('../model/registerKey.js');
const BannedIP = require('../model/bannedip.js');
const ReportedPost = require('../model/reportedpost.js');

//======================================================================
// Exports
//======================================================================

/*
    Creates a new moderator user, using a register key. If the register key
    does not exist, then the user creation is cancelled. Password is encrypted
    before saving.

    @param username: Name of the new user.
    @param password: Password of the new user.
    @param registerKey: Unique register key that can only be used once.

    @return result (boolean): Whether the report operation is successful.
    @return message (String): Message associated with the result.
 */
const createUser = async(username, password, registerKey) => {
    try {
        var key = await RegisterKey.findOne({_id: registerKey});
        if (!key) {
            return {result: false, message: 'Invalid Register Key.'};
        }
    } catch (e) {
        console.log(e);
        return {result: false, message: 'An unexpected error occured.'};
    }

    password = await bcrypt.hash(password, 10);
    try {
        let user = new User({
            name: username,
            password: password,
            boards: [key['defaultBoard']]
        });

        await Promise.all([
            await user.save(),
            await key.remove()
        ]);

        console.log(user);
    } catch (e) {
        console.log(e);
        return {result: false, message: 'An unexpected error occured with account creation'};
    }

    return {result: true, message: `Account ${username} created!`};
}

//TODO: start and end date
const banIp = async(ip, startDate, endDate, reason, remarks) => {
    /*
    if (startDate.getTime() >= endDate.getTime()) {
        return {result: false, message: 'Start date should be earlier than end date.'};
    }

    let bannedIP = await BannedIP.findOne({ip: ip});
    if (bannedIP) {

    }
     */

    let bannedip = await BannedIP.exists({ip: ip});
    if (bannedip) {
        return {result: false, message: 'A ban on the IP already exists.'};
    }

    try {
        bannedip = new BannedIP({
            ip: ip,
            reason: reason,
            remarks: remarks
        });

        await Promise.all([
            ReportedPost.updateMany({ip: ip}, {banned: true}),
            bannedip.save()
        ]);
    } catch (e) {
        console.log(e);
        return {result: false, message: 'An unexpected error occured.'};
    }

    return {result: true, message: 'User succesfully banned.'};
}

const unbanIp = async (ip) => {

    try {
        let bannedip = await BannedIP.findOne({ip: ip});
        if (!bannedip) {
            return {result: false, message: 'UnbanIp: IP does not exist.'};
        }

        await Promise.all([
            ReportedPost.updateMany({ip: ip}, {banned: false}),
            bannedip.remove()
        ]);
    } catch (e) {
        console.log(e);
        return {result: false, message: 'An unexpected error occured in unbanning a post.'}
    }

    return {result: true, message: 'Successfully unbanned ip.'};
}

/*
    Generates a new

    @param username: Name of the new user.
    @param password: Password of the new user.
    @param registerKey: Unique register key that can only be used once.

    @return result (boolean): Whether the report operation is successful.
    @return message (String): Message associated with the result.
 */
const generateRegisterKey = async(defaultBoard) => {
    let exists = await Board.exists({name: defaultBoard});
    if (!exists) {
        return {key: null, message: 'generateRegisterKey: default board given does not exist'};
    }

    let key;
    try {
        key = new RegisterKey({
            defaultBoard: defaultBoard
        });

        await key.save();
    } catch (e) {
        console.log(e);
        return {key: null, message: 'generateRegisterKey: An unexpected error ocurred'}
    }
    console.log(key);

    return {key: key._id, message: 'Successfully created new register key.'};
}

/*
    Deletes a moderator and ONLY a moderator. 

    @param username: Name of the user to delete.
   
    @return result (boolean): Whether the user delete operation is successful.
    @return message (String): Message associated with the result.
 */
const deleteModerator = async(username) => {
    try {
        let moderator = await User.findOne({name: username, rank: 'MODERATOR'});
        if (!moderator) {
            return {result: false, message: 'Moderator does not exist'};
        }

        await moderator.remove();
    } catch (e) {
        console.log(e);
        return {result: false, message: 'An unexpected error occurred.'}
    }

    return {result: true, message: `Successfully deleted user ${username}`};
}

const removeBoards = async(username, boardsToRemove) => {
    if (boardsToRemove.length === 0) {
        return {result: false, message: 'No boards given to remove.'};
    }

    try {
        let moderator = await User.findOne({name: username, rank: 'MODERATOR'});
        if (!moderator) {
            return {result: false, message: 'Moderator does not exist.'};
        }

        let set = new Set(moderator.boards);
        for (let i = 0; i < boardsToRemove.length; i++) {
            set.delete(boardsToRemove[i]);
        }

        moderator.boards = Array.from(set);

        await moderator.save();
    } catch (e) {
        console.log(e);
        return {result: false, message: 'An unexpected error occurred.'};
    }

    return {result: true, message: `Boards ${boardsToRemove} successfully removed from ${username}`};
} 

/*
const addBoard = async(username, board) => {
    try {
        let moderator = await User.findOne({name: username, rank: 'MODERATOR'});
        if (!moderator) {
            return {result: false, message: ''}
        }
    }
} */
module.exports = {
    createUser,
    banIp,
    unbanIp,
    generateRegisterKey,
    deleteModerator,
    removeBoards
}
