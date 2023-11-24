import { Router } from 'express';
import { check } from 'express-validator';

import * as sizeCtrl from '../controllers/size.controller.js';
import { authJwt, verifySignUp } from '../middlewares/index.js';

const router = Router();

router.get(
  '/:sizeId',
  [
    check('sizeId', 'Id is not a valid MongoDb Id.').isMongoId(),
  ],
  sizeCtrl.getSizeById
);

router.get(
  '/product/:productId',
  [
    check('productId', 'Id is not a valid MongoDb Id.').isMongoId(),
  ],
  sizeCtrl.getSizesByProduct
);

router.get(
  '/number/:productId',
  [
    check('productId', 'Id is not a valid MongoDb Id.').isMongoId(),
    authJwt.verifyToken
  ],
  sizeCtrl.getSizeByProductAndNumber
);

router.put(
  '/:sizeId',
  [
    check('sizeId', 'Id is not a valid MongoDb Id.').isMongoId(),
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  sizeCtrl.updateSizeById
);

router.put(
  '/price/:sizeId',
  [
    check('sizeId', 'Id is not a valid MongoDb Id.').isMongoId(),
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  sizeCtrl.updatePriceOnSize
);

router.delete(
  '/:sizeId',
  [
    check('sizeId', 'Id is not a valid MongoDb Id.').isMongoId(),
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  sizeCtrl.deleteSizeById
);

export default router;