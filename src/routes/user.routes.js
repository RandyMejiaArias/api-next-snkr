import { Router } from 'express';
import { check } from 'express-validator';

import * as usersCtrl from '../controllers/user.controller.js';
import { authJwt, verifySignUp } from '../middlewares/index.js';
const router = Router();

router.get(
  '/',
  usersCtrl.getUsers
);

router.get(
  '/me',
  [
    authJwt.verifyToken,
    authJwt.isVerifiedUser
  ],
  usersCtrl.getUserByToken
);

router.get(
  '/:userId',
  [
    check('userId', 'Id is not a valid MongoDb Id.').isMongoId()
  ],
  usersCtrl.getUserById
);

router.post(
  '/',
  [
    authJwt.verifyToken,
    authJwt.isAdmin,
    verifySignUp.checkDuplicateUsernameOrEmail,
    verifySignUp.checkRoleExisted
  ],
  usersCtrl.createUser
);

router.put(
  '/admin/:userId',
  [
    check('userId', 'Id is not a valid MongoDb Id.').isMongoId(),
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  usersCtrl.updateUserByIdByAdmin
);

router.put(
  '/updateUser',
  [
    authJwt.verifyToken,
    authJwt.isVerifiedUser
  ],
  usersCtrl.updateUserById
);

router.put(
  '/changePassword/',
  [
    check('password', 'Mandatory field.').not().isEmpty(),
    check('newPassword', 'Mandatory field.').not().isEmpty(),
    authJwt.verifyToken,
    authJwt.isVerifiedUser
  ],
  usersCtrl.changePassword
);

router.delete(
  '/admin/:userId',
  [
    check('userId', 'Id is not a valid MongoDb Id.').isMongoId(),
    authJwt.verifyToken,
    authJwt.isAdmin
  ],
  usersCtrl.deleteUserByIdByAdmin
);

router.delete(
  '/deleteUser',
  [
    authJwt.verifyToken,
    authJwt.isVerifiedUser
  ],
  usersCtrl.deleteUserById
);

router.post(
  '/forgot',
  [
    check('email', 'Mandatory field.').isEmail()
  ],
  usersCtrl.forgotPassword
);

router.put(
  '/resetPassword/:requestId',
  [
    check('userId', 'Id is not a valid MongoDb Id.').isMongoId(),
    check('newPassword', 'Mandatory field.').isEmail(),
    authJwt.isVerifiedUser
  ],
  usersCtrl.resetPassword
);

export default router;
