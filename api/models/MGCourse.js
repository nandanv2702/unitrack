const mongoose = require('mongoose');
const { v1 } = require('uuid')

const Schema = mongoose.Schema;

module.exports = new Schema({
    _id: { type: String, default: v1 },
    number: Number,
    name: String,
    names: [String],
    subjects: [Object],
    url: String
});
