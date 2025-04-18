import "dotenv/config";
import * as client from "openid-client";
import jwt from "jsonwebtoken";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URI;
const SERVER_URL = "https://accounts.google.com";

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URL || !SERVER_URL) {
  throw Error("All Parameters are not passed!");
}

async function openConnect({
  server_uri,
  clientId,
  clientSecret,
  redirect_uri,
}: {
  server_uri: URL;
  redirect_uri: string;
  clientId: string;
  clientSecret: string;
}) {
  try {
    // Discover Google OIDC provider metadata
    const config = await client.discovery(server_uri, clientId, clientSecret);

    const codeVerifier = client.randomPKCECodeVerifier();
    const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

    const authorizationParamters: {
      redirect_uri: string;
      scope: string;
      code_challenge: string;
      code_challenge_method: string;
      state?: string;
    } = {
      redirect_uri,
      scope: "openid email profile",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    };

    if (!config.serverMetadata().supportsPKCE()) {
      authorizationParamters.state = client.randomState();
    }

    const authUrl = client.buildAuthorizationUrl(config, authorizationParamters);
    console.log("Visit this URL to authorize:", authUrl.href);
  } catch (error) {
    console.error("Error during OpenID flow:", error);
  }
}

async function handleGoogleCallback(code: string, redirect_uri: string) {
  try {
    const config = await client.discovery(new URL(SERVER_URL), CLIENT_ID, CLIENT_SECRET);

    // Exchange the code for tokens
    const tokenSet = await config.authorizationCodeGrant(code, redirect_uri, {
      code_verifier: config.codeVerifier, // The PKCE code verifier used previously
    });

    // Validate and decode the ID Token
    const idToken = tokenSet.id_token;
    const decoded = client.decodeJwt(idToken);

    // You can check the token's validity, for example by using its `sub` field
    const user = {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    };

    console.log("Google User:", user);

    // Now generate your own custom JWT access and refresh tokens
    const accessToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1h", // You can adjust this expiration as needed
    });

    const refreshToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "7d", // Set refresh token expiration time as per your requirement
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error during Google Callback handling:", error);
    throw new Error("Failed to handle Google callback");
  }
}

openConnect({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  server_uri: new URL(SERVER_URL),
  redirect_uri: REDIRECT_URL,
});

// Assuming you have a route handler for the callback URL
async function googleAuthCallbackHandler(req, res) {
  try {
    const code = req.query.code as string; // Get the 'code' query parameter from the callback
    const { accessToken, refreshToken } = await handleGoogleCallback(code, REDIRECT_URL);
    
    // Send the tokens back to the client
    res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
