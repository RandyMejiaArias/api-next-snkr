import { Router } from 'express';
import { check } from 'express-validator';

import * as authCtrl from '../controllers/auth.controller.js';
import { verifySignUp } from '../middlewares/index.js';
const router = Router();

router.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  );
  next();
});

router.post(
  '/signup',
  [
    check('email', 'Field must be a valid mail.').isEmail(),
    check('password', 'Mandatory field.').not().isEmpty(),
    check('username', 'Mandatory field.').not().isEmpty(),
    check('role', 'Mandatory field.').not().isEmpty(),
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRoleExisted
  ],
  authCtrl.signUp
);

router.post(
  '/signin',
  [
    check('email', 'Field must be a valid mail.').isEmail(),
    check('password', 'Mandatory field.').not().isEmpty()
  ],
  authCtrl.signIn
);

export default router;
