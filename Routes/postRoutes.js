const {Router} = require('express');

const  { createPost, getPosts, getpost, getCatPosts, getUserPosts, editPost, deletePost } =require('../Controllers/postController')

const router = Router()

router.post('/', createPost)
router.get('/', getPosts)
router.get('/:id', getpost)
router.get('/categories/:category', getCatPosts)
router.get('/users/:id', getUserPosts)
router.patch('/:id', editPost)
router.delete('/:id', deletePost)

module.exports  = router