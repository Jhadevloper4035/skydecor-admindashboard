const path = require("path");
const dotenv = require("dotenv");

const NODE_ENV = process.env.NODE_ENV || "development";
const envFile = path.resolve(process.cwd(), `.env.${NODE_ENV}`);
const result = dotenv.config({ path: envFile, quiet: true });

if (result.error) {
  console.error(`❌ Failed to load env file: .env.${NODE_ENV}`);
  process.exit(1);
}

console.log(`🌍 Environment: ${NODE_ENV}`);
module.exports = NODE_ENV;
