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

module.exports = {
    createUser
}
