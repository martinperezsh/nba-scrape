const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new mongoose.Schema({
    title: String,
    
    link: String,
   
});

// create the Article model using the NewsSchema
const Post = mongoose.model('Post', PostSchema);

// export the Articles model
module.exports = Post;