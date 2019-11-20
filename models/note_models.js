var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title: {
        type: String,
        require: true
    },

    body: {
        type: String,
        require: true
    }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;