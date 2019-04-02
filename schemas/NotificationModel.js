const mongoose = require('mongoose');
const schema = mongoose.Schema;

const notificationSchema = new Schema ({

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('')