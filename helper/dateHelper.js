const formatDate = (date) => {
    let isoString = date.toISOString().split('T')[0];
    let dayOfWeekString = date.toString().split(' ')[0];
    let hourString = date.toLocaleTimeString();

    return `${isoString} (${dayOfWeekString}) ${hourString}`;
}

module.exports = {formatDate};