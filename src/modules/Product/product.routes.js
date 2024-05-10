import { Router } from "express";
import * as productController from "./product.controller.js";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";
import { endPointsRoles } from "./product.endpoints.roles.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { likeProductSchema } from "./product.validatorSchema.js";
const router = Router();

// router.use(auth(['admin']))

router.get(
  "/",
  auth(endPointsRoles.GET_ALL_PRODUCTS),
  expressAsyncHandler(productController.getAllProducts)
);
router.post(
  "/",
  auth(endPointsRoles.ADD_PRODUCT),
  multerMiddleHost({ extensions: allowedExtensions.image }).array("image", 2),
  expressAsyncHandler(productController.addproduct)
);
router.post(
  "/like/:productId",
  auth(endPointsRoles.ADD_PRODUCT),
  validationMiddleware(likeProductSchema),
  expressAsyncHandler(productController.likeOrUnlikeProduct)
);
router.get(
  "/getlikes/:productId",
  expressAsyncHandler(productController.getAllLikesForProduct)
);

router.put(
  "/update/:productId",
  auth(),
  multerMiddleHost({
    extensions: allowedExtensions.image,
  }).single("image"),
  expressAsyncHandler(productController.updateProduct)
);

router.delete(
  "/delete/:productId",
  auth(),
  expressAsyncHandler(productController.deleteProduct)
);

export default router;
