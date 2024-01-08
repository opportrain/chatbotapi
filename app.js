const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
dotenv.config();
const admin = require("firebase-admin")
const algoliasearch = require('algoliasearch')
const client = algoliasearch('*********', '**********************')
const index = client.initIndex("********");
app.use(bodyParser.json());
admin.initializeApp({
    credential: admin.credential.cert("******.json")
});
const firestore = admin.firestore();
app.post('/add_user', async (req, res) => {
    const data = req.body;

    console.log(data);
    const doc = await firestore.collection("users-data").doc("uuid-" + req.body.user).set({"UUID": req.body.user});
    await firestore.collection("users-data").doc("uuid-" + req.body.user).get();

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
        await firestore.collection("users-data").doc(req.body.user).set({"UUID": req.body.user});
    }

});

app.post('/search_opp', async (req, res) => {
    const data = req.body;
    let oppToSend = []
    try {
        const result = await index.search(data.token, {
            attributesToRetrieve: ['name', 'location', 'mode', 'link'],
            hitsPerPage: 50, filters: `mode:${data.mode} OR location:${data.location}`
        });

        for (const opp of result['hits']) {
            oppToSend.push({"name": opp.name, "location": opp.location, "link": opp.link, "mode": opp.mode})
        }
        res.json(oppToSend);
    } catch (e) {

        const result = await index.search(data.token, {
            attributesToRetrieve: ['name', 'location', 'mode', 'link'],
        });
        for (const opp of result['hits']) {
            oppToSend.push({"name": opp.name, "location": opp.location, "link": opp.link, "mode": opp.mode})
        }
        res.json(oppToSend);
    }

});
app.get('/get_track_count/:name', async (req, res) => {
    console.log(req.params.name)
    const q = await firestore.collection('opportunities').where('track', '==', req.params.name).count().get();
    const count = q.data().count;
    res.json({count})
})
const functions = require("firebase-functions/v2")
exports.opportrain = functions.https.onRequest(app);
