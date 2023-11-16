import { Router } from 'express';
import { check } from 'express-validator';

import * as scoreCharCtrl from '../controllers/scoringCharacteristic.controller.js';
import { authJwt, verifySignUp } from '../middlewares/index.js';

const router = Router();

router.get(
  '/',
  scoreCharCtrl.getScoringCharacteristics
);

router.get(
  '/:scoringCharacteristicId',
  [
    check('scoringCharacteristicId', 'Id is not a valid MongoDb Id.').isMongoId()
  ],
  scoreCharCtrl.getScoringCharacteristicById
);

router.post(
  '/',
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
  ],
  scoreCharCtrl.createScoringCharacteristic
);

router.put(
  '/:scoringCharacteristicId',
  [
    check('scoringCharacteristicId', 'Id is not a valid MongoDb Id.').isMongoId(),
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  scoreCharCtrl.updateScoringCharacteristicById
);

router.delete(
  '/:scoringCharacteristicId',
  [
    check('scoringCharacteristicId', 'Id is not a valid MongoDb Id.').isMongoId(),
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  scoreCharCtrl.deleteScoringCharacteristicById
);

export default router;