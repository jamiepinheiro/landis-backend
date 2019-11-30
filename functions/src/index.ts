// export GOOGLE_APPLICATION_CREDENTIALS="/Users/jamiepinheiro/LandisProject/landis-project-firebase-adminsdk-7drp8-55f2dd6f4f.json"

const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: "https://landis-project.firebaseio.com"
});

export const db = admin.firestore();

export * from './seedDataApi';
export * from './accountsApi'