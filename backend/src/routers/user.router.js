import express from 'express'
import { editProfile, getCurrentUser, getOtherUsers, search } from '../controllers/user.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const userRouter = express.Router()

userRouter.get('/current-user', isAuth, getCurrentUser)

userRouter.patch('/profile',isAuth, upload.single("image"), editProfile)

userRouter.get('/other-users',isAuth, getOtherUsers)

userRouter.get('/search',isAuth, search)


export default userRouter;