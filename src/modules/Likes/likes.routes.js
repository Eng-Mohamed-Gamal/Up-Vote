

import { Router } from "express";
import * as likesController from './likes.controller.js';
import { auth } from "../../middlewares/auth.middleware.js";
import expressAsyncHandler from "express-async-handler";
import { endPointsRoles } from "./like.endpoints.roles.js";
const router = Router()



router.get('/', auth(), expressAsyncHandler(likesController.getUserLikesHistory))

router.post('/:likeDoneOnId', auth(endPointsRoles.LIKE), expressAsyncHandler(likesController.likeOrUnlike))




export default router