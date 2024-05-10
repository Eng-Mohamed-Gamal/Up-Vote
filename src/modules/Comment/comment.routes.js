
import { Router } from "express";
import * as commentController from './comment.controller.js';
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPointsRoles } from "./comment.endpoints.roles.js";
const router = Router()

router.post(
    '/add/:productId', 
    auth(endPointsRoles.ADD_COMMENT), 
    expressAsyncHandler(commentController.addComment)
    )

router.post(
    '/like/:commentId',
    auth(endPointsRoles.LIKE_COMMENT),
    expressAsyncHandler(commentController.likeOrUnlikeComment)
)
export default router