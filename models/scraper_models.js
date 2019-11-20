var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    articleTitle : {
        type: String,
        require: true
    },

    link: {
        type: String,
        require: true
    },

    articleBody: {
        type: String,
        require: true
    },

    saveStatus: {
        type: Boolean,
    },

    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;


