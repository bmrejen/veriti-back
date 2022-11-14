import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TENANT_ID = process.env.TENANT_ID;
import fetch from "node-fetch";

export async function getToken() {
  try {
    return fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&scope=https://securitycenter.onmicrosoft.com/windowsatpservice/.default&client_secret=${CLIENT_SECRET}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    }).then((res) => {
      return res.json();
    });
  } catch (err) {
    console.error(err);
  }
}
