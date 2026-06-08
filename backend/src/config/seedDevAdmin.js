const User = require("../model/user.model.js");

async function seedDevAdmin() {
  if (process.env.NODE_ENV !== "development") return;

  const name = process.env.DEV_ADMIN_NAME;
  const password = process.env.DEV_ADMIN_PASSWORD;

  if (!name || !password) return;

  const existingUser = await User.findOne({ name });
  if (existingUser) return;

  await User.create({
    name,
    password,
    accessType: "superadmin",
  });

  console.log(`Development admin user created: ${name}`);
}

module.exports = { seedDevAdmin };
