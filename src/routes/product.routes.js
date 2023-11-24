import { Router } from 'express';
import { check } from 'express-validator';

import * as productCtrl from '../controllers/product.controller.js';
import { authJwt, verifySignUp } from '../middlewares/index.js';
const router = Router();

router.get(
  '/',
  productCtrl.getProducts
);

router.get(
  '/search',
  productCtrl.searchProducts
);

router.get(
  '/:productId',
  productCtrl.getProductById
);

export default router;