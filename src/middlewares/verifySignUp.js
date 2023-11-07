import User from '../models/User.js';
import { Role } from '../models/Role.js';

const checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username
    });
    if (user) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const email = await User.findOne({
      email: req.body.email
    });
    if (email) {
      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: error
    });
  }
};

const checkRoleExisted = async (req, res, next) => {
  if (req.body.role) {
    if (!Role.includes(req.body.role)) {
      return res.status(400).json({
        message: `Role ${req.body.role} does not exist`
      });
    }
  }
  next();
};

export { checkDuplicateUsernameOrEmail, checkRoleExisted };
