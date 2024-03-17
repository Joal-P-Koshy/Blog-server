const bcrypt = require('bcryptjs')
const User = require('../Models/userModel')
const HttpError = require('../Models/errorModel')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const { v4: uuid } = require('uuid')



// user register
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password) {
            return next(new HttpError('Please fill the form completely.', 422))
        }
        const newEmail = email.toLowerCase();
        const emailExists = await User.findOne({ email: newEmail });

        if (emailExists) {
            return next(new HttpError('Email already exists.', 422))
        }

        if ((password.trim()).length < 6) {
            return next(new HttpError('Password should be at least 6 characters', 422))
        }

        if (password != password2) {
            return next(new HttpError('Passwords do not match.', 422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt);
        const newUser = await User.create({ name, email: newEmail, password: hashedPass });
        res.status(201).json(`New user ${newUser.email} registered.`);

    } catch (error) {
        return next(new HttpError("User registration failed. ", 422))
    }
}





// user login
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new HttpError('Please fill the form completely.', 422))
        }

        const newEmail = email.toLowerCase();

        const user = await User.findOne({ email: newEmail });

        if (!user) {
            return next(new HttpError('Invalid email.', 422))
        }

        const comparePass = await bcrypt.compare(password, user.password)
        if (!comparePass) {
            return next(new HttpError('Invalid Password', 422))
        }

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.status(200).json({ token, id, name })

    } catch (error) {
        return next(new HttpError('Login failed. Check your email and password', 422))
    }
}





// user profile
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password');
        if (!user) {
            return next(new HttpError('User not found.', 404))
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}





// change user avatar( profile pic )
const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files.avatar) {
            return next(new HttpError('Please select an image.', 422))
        }

        // find user from db
        const user = await User.findById(req.user.id)

        // delete old avatar if exists
        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    return next(new HttpError(err))
                }
            })
        }

        const { avatar } = req.files;

        // file size
        if (avatar.size > 500000) {
            return next(new HttpError('File size too big. Should be less than 500kb', 422))
        }

        let fileName = avatar.name;
        let splittedFileName = fileName.split('.')
        let newFilename = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1]
        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError(err))
            }
            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true })
            if (!updatedAvatar) {
                return next(new HttpError('Avatar could not be changed.', 422))
            }
            res.status(200).json(updatedAvatar)
        })

    } catch (error) {
        return next(new HttpError(error))
    }
}






// edit user details (from profile)
const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;
        if (!name || !email || !currentPassword || !newPassword) {
            return next(new HttpError('Please fill the form completely', 422))
        }

        // get user from db
        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError('User not found.', 403))
        }

        // new email doesn't already exists
        const emailExist = await User.findOne({ email });
        if (emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpError('Email already exist.', 422))
        }

        // compare current pass with db pass
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validateUserPassword) {
            return next(new HttpError('Invalid current password', 422))
        }

        // compare new passwords
        if (newPassword !== confirmNewPassword) {
            return next(new HttpError('New passwords do not match', 422))
        }

        // hash new password
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt);

        // update user info in db
        const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: hash }, { new: true })
        res.status(200).json(newInfo)

    } catch (error) {
        return next(new HttpError(error))
    }
}






// get authors details (from profile)
const getAuthors = async (req, res, next) => {
    try {
        const autors = await User.find().select('-password');
        res.json(autors);
    } catch (error) {
        return next(new HttpError(error))
    }
}




module.exports = { registerUser, loginUser, getUser, changeAvatar, editUser, getAuthors }