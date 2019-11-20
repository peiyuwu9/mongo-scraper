var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    articleTitle : {
        type: String,
        required: true
    },

    link: {
        type: String,
        required: true
    },

    articleBody: {
        type: String,
        // required: true
    },

    saveStatus: {
        type: Boolean
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;


