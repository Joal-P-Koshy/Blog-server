

// create post
const createPost = async(req, res, next) => {
    res.json('Create post')
}


// get all posts
const getPosts = async(req, res, next) => {
    res.json('get all posts')
}


// get single post
const getpost = async(req, res, next) => {
    res.json('get single post')
}


// get post by category
const getCatPosts = async(req, res, next) => {
    res.json('get post by category')
}


// get post by user
const getUserPosts = async(req, res, next) => {
    res.json('get post by user')
}


// edit post
const editPost = async(req, res, next) => {
    res.json('edit  post')
}


// delete post
const deletePost = async(req, res, next) => {
    res.json('delete post')
}


module.exports = { createPost, getPosts, getpost, getCatPosts, getUserPosts, editPost, deletePost }