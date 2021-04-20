const mongoose = require('mongoose');

const Statuses = new mongoose.Schema({
    uid: {type: String, unique: true},
    local: {type: Object, default: null},
    global: {type: Object, default: null}
});

module.exports = mongoose.model('customStatuses', Statuses);