import express from 'express'
import { isAuth } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { sendMessage, getMessages } from '../controllers/message.controller.js';

const messageRouter = express.Router()

messageRouter.post('/send/:receiver', isAuth, upload.single("image"), sendMessage)

messageRouter.get('/get/:receiver', isAuth, getMessages)


export default messageRouter;
