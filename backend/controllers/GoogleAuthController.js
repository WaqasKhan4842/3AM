import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/auth/google/callback";

class GoogleAuthController {
  static getGoogleAuthURL() {
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email`;
  }

  static async handleGoogleCallback(code) {
    try {
      const { data } = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      });

      const { access_token } = data;

      const { data: profile } = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      return profile;
    } catch (error) {
      console.error("Google Auth Error:", error.response?.data || error);
      throw new Error("Google authentication failed");
    }
  }
}

export default GoogleAuthController;  // ✅ Ensure it is exported correctly
