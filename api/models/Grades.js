const mongoose = require('mongoose');
const { v1 } = require('uuid')

const Schema = mongoose.Schema;

module.exports = new Schema({
    courseUuid: { type: String, default: v1 },
    cumulative: Object,
    courseOfferings: Object
});