const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config();
const admin = require("firebase-admin")
app.use(bodyParser.json());
admin.initializeApp({
    credential: admin.credential.cert("service.json")
});
const firestore = admin.firestore();
app.post('/add_user', async (req, res) => {
    const data = req.body;

    console.log(data);
    const doc = await firestore.collection("users-data").doc("uuid-" + req.body.user).set({"UUID": req.body.user});
    const q = await firestore.collection("users-data").doc("uuid-" + req.body.user).get();

    res.json({"from_bot": true, "added_user": req.body.user, "write_time": doc.writeTime});

});
app.post('/get_user', async (req, res) => {
    const data = req.body;

    console.log(data);
    const q = await firestore.collection("users-data").doc(req.body.user).get();

    res.json({"UUID": q.data()['UUID']});

});
app.post('/check_user', async (req, res) => {
    const data = req.body;

    console.log(data);
    const q = await firestore.collection("users-data").doc(req.body.user).get();
    if (q.exists) {
        res.json({"user_exists": "exists"});

    } else {
        res.json({"user_exists": "dne"});
        await firestore.collection("users-data").doc(req.body.user).set({"UUID": req.body.user}) ;
    }

});


const functions = require("firebase-functions/v2")
const {credential} = require("firebase-admin");

exports.opportrain = functions.https.onRequest(app);
