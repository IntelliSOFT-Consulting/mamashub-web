const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');


console.log('Loading environment variables from .env file');

// throw an error if the .env file is not found 
if (!fs.existsSync(path.join(__dirname, '.env'))) {
    throw new Error('The .env file is missing');
}


const envConfig = dotenv.parse(fs.readFileSync(path.resolve(__dirname, './.env')));

fs.writeFileSync(
    path.resolve(__dirname, './src/config/fcmConfig.json'),
    JSON.stringify({
        type: envConfig.FIREBASE_TYPE,
        project_id: envConfig.FIREBASE_PROJECT_ID,
        private_key_id: envConfig.FIREBASE_PRIVATE_KEY_ID,
        private_key: envConfig.FIREBASE_PRIVATE_KEY,
        client_email: envConfig.FIREBASE_CLIENT_EMAIL,
        client_id: envConfig.FIREBASE_CLIENT_ID,
        auth_uri: envConfig.FIREBASE_AUTH_URI,
        token_uri: envConfig.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: envConfig.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: envConfig.FIREBASE_CLIENT_X509_CERT_URL,
    })
);

console.log('fcmConfig.json file created');



