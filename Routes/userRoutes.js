
const {Router} = require('express');

const {registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors} = require('../Controllers/userControllers')

const authMiddleware = require('../Middlewares/authMiddleware')

const router = Router()

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.get('/', getAuthors);
router.post('/change-avatar', authMiddleware, changeAvatar);
router.patch('/edit-user', editUser);

module.exports  = router