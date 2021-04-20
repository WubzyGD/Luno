const mongoose = require('mongoose');

const Mute = new mongoose.Schema({
    uid: {type: String, unique: true},
    until: String,
    mutedBy: String,
    reason: {type: String, default: ''}
});

module.exports = mongoose.model('mute', Mute);