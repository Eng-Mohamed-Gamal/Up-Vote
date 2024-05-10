import { Router } from "express";
import * as replyController from './reply.controller.js';
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPointsRoles } from "./reply.endpoints.roles.js";
const router = Router()

router.post('/add/:replyOnId', auth(endPointsRoles.ADD_REPLY), expressAsyncHandler(replyController.addReply))
router.post('/like/:replyId', auth(endPointsRoles.LIKE_REPLY), expressAsyncHandler(replyController.likeOrUnlikeReply))
export default router