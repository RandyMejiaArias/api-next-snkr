import { Router } from 'express';
import { check } from 'express-validator';
const router = Router();

import * as prefScoreCtrl from '../controllers/preferredScoring.js';
import { authJwt } from '../middlewares/index.js';

router.get(
  '/',
  [
    authJwt.verifyToken,
    authJwt.isVerifiedUser
  ],
  prefScoreCtrl.getPreferredScoringByUser
);

router.post(
  '/',
  [
    authJwt.verifyToken,
    authJwt.isVerifiedUser
  ],
  prefScoreCtrl.addScoreToPreferredScoring
);

router.put(
  '/:preferredScoringId',
  [
      check('preferredScoringId', 'Id is not a valid MongoDb Id.').isMongoId(),
      authJwt.verifyToken
  ],
  prefScoreCtrl.changeScoreOfCharacteristicOnPreferredScoring
);

export default router;