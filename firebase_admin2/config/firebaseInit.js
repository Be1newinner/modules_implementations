const admin = require("firebase-admin");
const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
const { Storage } = require('@google-cloud/storage');

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL:
    "https://wingfi-9b5b7-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credentials: {
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
  },
});

const firestore = admin.firestore(app);
const auth = admin.auth(app);
const realtimeDb = admin.database(app);
const bucket = storage.bucket("wingfi-9b5b7.appspot.com");


// bucket.getFiles({
//   prefix: '',         // Root directory
//   delimiter: '/',     // Delimit folders
// }).then(([files, , apiResponse]) => {
//   const fileNames = files.map(file => file.name);
//   console.log("Files in the root:", fileNames);

//   const folders = apiResponse.prefixes || [];
//   console.log("Folders in the root:", folders);
// }).catch(err => console.error("Error fetching files:", err));



module.exports = { app, firestore, auth, realtimeDb, bucket, storage };
