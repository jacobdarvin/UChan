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
const RegisterKey = require('../model/registerKey.js');
const BannedIP = require('../model/bannedip.js');

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
        var key = await RegisterKey.findOne({key: registerKey});
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
            password: password
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

    let bannedip = await BannedIP.exists();
    if (bannedip) {
        return {result: false, message: 'A ban on the IP already exists.'};
    }

    try {
        bannedip = new BannedIP({
            ip: ip,
            reason: reason,
            remarks: remarks
        });
        bannedip.save();
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

        await bannedip.remove();
    } catch (e) {
        console.log(e);
        return {result: false, message: 'An unexpected error occured in unbanning a post.'}
    }

    return {result: true, message: 'Successfully unbanned ip.'};
}

module.exports = {
    createUser,
    banIp
}
