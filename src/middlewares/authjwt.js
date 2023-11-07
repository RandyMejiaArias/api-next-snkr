import jwt from 'jsonwebtoken';
import config from '../config.js';
import User from '../models/User.js';
import Role from '../models/Role.js';

export const verifyToken = async (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).json({
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId, { password: 0 });
    if (!user) {
      return res.status(404).json({
        message: 'No user found'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const role = await Role.find({
      _id: {
        $in: user.role
      }
    });

    for (let i = 0; i < role.length; i++) {
      if (role[i].name === 'administrator') {
        next();
        return;
      }
    }

    return res.status(403).json({
      message: 'Require Admin Role!'
    });
  } catch (error) {
    return res.status(500).json({
      message: error
    });
  }
};

export const isVerifiedUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.emailVerified) {
      next();
      return;
    }
    return res.status(403).json({
      message: 'Your account must had been verified to continue.'
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
