// src/config/workos.config.js
require("dotenv").config();
const { WorkOS } = require("@workos-inc/node");

const WORKOS_API_KEY = process.env.WORKOS_API_KEY;
const WORKOS_CLIENT_ID = process.env.WORKOS_CLIENT_ID;
const REDIRECT_URI = process.env.REDIRECT_URI;
// Validation
if (!WORKOS_API_KEY) {
  console.error("❌ WORKOS_API_KEY chưa được cấu hình.");
  process.exit(1);
}
if (!WORKOS_CLIENT_ID) {
  console.error("❌ WORKOS_CLIENT_ID chưa được cấu hình.");
  process.exit(1);
}

const workos = new WorkOS(WORKOS_API_KEY);

const workosConfig = {
  workos,
  clientId: WORKOS_CLIENT_ID,
  redirectUri: REDIRECT_URI,
};

module.exports = workosConfig;
