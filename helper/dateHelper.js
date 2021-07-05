/*
*
*   Module for date parsing and processing operations.
*
*/

//======================================================================
// Exports
//======================================================================

/**
 * Formats a date into 
 *  <Year-Month-Date> (Day of week) <Hour> <PM/AM>
 * 
 * @param {Date} date the date to parse and convert into the format 
 */
const formatDate = (date) => {
    let isoString = date.toISOString().split('T')[0];
    let dayOfWeekString = date.toString().split(' ')[0];
    let hourString = date.toLocaleTimeString();

    return `${isoString} (${dayOfWeekString}) ${hourString}`;
}

module.exports = {formatDate};