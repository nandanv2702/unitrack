const mongoose = require('mongoose');
const { v1 } = require('uuid')

const Schema = mongoose.Schema;

module.exports = new Schema({
    _id: { type: String, default: v1 },
    pkId: { type: Number, required: true },
    numRatings: { type: Number, required: true },
    firstName: { type: String, required: true, lowercase: true },
    lastName: { type: String, required: true, lowercase: true },
    avgRating: { type: Number, required: true }
});