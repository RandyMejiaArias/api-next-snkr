import jwt from 'jsonwebtoken';
import config from '../config.js';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { getConfirmUserTemplate } from '../mailTemplates/confirmUserTemplate.js';
import { sendMail } from '../utils/mailer.js';

export const signUp = async (req, res) => {
  try {
    // Getting the Request body
    const { username, email, password, role } = req.body;

    // Creating a new User Object
    const newUser = new User({
      username,
      email,
      password: await User.encryptPassword(password)
    });

    const foundRole = await Role.find({
      name: {
        $in: role
      }
    });
    newUser.role = foundRole.map((role) => role._id);

    // Saving the User Object in MongoDB
    const savedUser = await newUser.save();

    // Create a token
    const token = jwt.sign(
      {
        email: savedUser.email
      },
      config.SECRET,
      {
        expiresIn: Number(config.TOKEN_TIMEOUT) // 24 hours
      }
    );

    const template = getConfirmUserTemplate(token);
    await sendMail('Accounts', config.MAIL_USER, email, 'Confirm your account', template);

    return res.status(201).json({
      message: 'User registered succesfully',
      data: token
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const signIn = async (req, res) => {
  try {
    const userFound = await User.findOne({
      email: req.body.email
    }).populate('role');

    if (!userFound) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const matchPassword = await User.comparePassword(req.body.password, userFound.password);

    if (!matchPassword) {
      return res.status(401).json({
        message: 'Invalid Pasword',
        token: null
      });
    }

    const token = jwt.sign(
      {
        id: userFound._id
      },
      config.SECRET,
      {
        expiresIn: Number(config.TOKEN_TIMEOUT) // 24 hours
      }
    );

    return res.status(200).json({
      message: 'User authenticaded succesfully!',
      data: {
        token
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error
    });
  }
};
