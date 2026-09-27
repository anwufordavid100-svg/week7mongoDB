const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
});


const Todomodel = mongoose.model('Todo', todoSchema);
module.exports = Todomodel;