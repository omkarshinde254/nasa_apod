const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false
    },
    oauth: {
        type: String,
        required: true
    }

},
{collection: 'user-data'}
);

const model = mongoose.model('User', user);
module.exports = model;