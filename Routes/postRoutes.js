const {Router} = require('express');

const  { createPost, getPosts, getpost, getCatPosts, getUserPosts, editPost, deletePost } =require('../Controllers/postController')

const authMiddleware = require('../Middlewares/authMiddleware')

const router = Router()

router.post('/', authMiddleware, createPost)
router.get('/', getPosts)
router.get('/:id', getpost)
router.get('/categories/:category', getCatPosts)
router.get('/users/:id', getUserPosts)
router.patch('/:id', authMiddleware, editPost)
router.delete('/:id', authMiddleware, deletePost)

module.exports  = router

