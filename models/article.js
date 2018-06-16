let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  
  summary: {
    type: String,
    required: true
  },
  
  link: {
    type: String,
    required: true
  },
  
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Creates model from ArticleSchema
let Article = mongoose.model("Article", ArticleSchema);

// Export Schema Model
module.exports = Article;