import { Router } from "express";
import * as userController from './user.controller.js'
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { signUpSchema } from "./user.validationSchemas.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";

const router = Router()



router.post('/', validationMiddleware(signUpSchema), expressAsyncHandler(userController.SignUpHandeler))
router.post('/login', expressAsyncHandler(userController.SignInHandeler))
router.get('/', auth(), expressAsyncHandler(userController.getUserProfile))
router.put('/', auth(), expressAsyncHandler(userController.updateAccount))
router.delete('/', auth(), expressAsyncHandler(userController.deleteAccount))


router.post('/upload',
    multerMiddleHost({
        extensions: allowedExtensions.image,
    }).single('image'),
    expressAsyncHandler(userController.fileUpload))

export default router
