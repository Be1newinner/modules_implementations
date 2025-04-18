import "dotenv/config"
import * as client from 'openid-client';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URL = process.env.REDIRECT_URI;
const SERVER_URL = "https://accounts.google.com";

async function openConnect({ server_uri, clientId, clientSecret, redirect_uri }) {
    try {
        const config = await client.discovery(server_uri, clientId, clientSecret);

        const codeVerifier = client.randomPKCECodeVerifier();
        const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);

        const authorizationParamters = {
            redirect_uri,
            scope: 'openid email profile',
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
        }

        if (!config.serverMetadata().supportsPKCE()) {
            authorizationParamters.state = client.randomState();
        }

        const authUrl = client.buildAuthorizationUrl(config, authorizationParamters);

        console.log('🔐 Visit this URL to authorize:', authUrl.href);
    } catch (error) {
        console.error('❌ Error during OpenID flow:', error);
    }
}

openConnect({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    server_uri: new URL(SERVER_URL),
    redirect_uri: new URL(REDIRECT_URL)
});
