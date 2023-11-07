import Role from '../models/Role.js';
import User from '../models/User.js';
import config from '../config.js';

import bcrypt from 'bcryptjs';

export const createRol = async () => {
  try {
    // Check for existing rol
    const count = await Role.countDocuments();
    if (count > 0) { return; }

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: 'user' }).save(),
      new Role({ name: 'administrator' }).save()
    ]);
    console.log('Roles created');
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};

export const createAdmin = async () => {
  // Check for an existing user
  const user = await User.findOne({ email: config.DB_ADMIN_EMAIL });

  // Get Rol _id
  const role = await Role.find({
    name: {
      $in: ['administrator']
    }
  });

  if (!user) {
    // Create a new admin user
    await User.create({
      username: config.DB_ADMIN_USER,
      email: config.DB_ADMIN_EMAIL,
      password: await bcrypt.hash(config.DB_ADMIN_PASS, 10),
      role: role.map((role) => role._id),
      emailVerified: true
    });
    console.log('Admin user created!');
  }
};
