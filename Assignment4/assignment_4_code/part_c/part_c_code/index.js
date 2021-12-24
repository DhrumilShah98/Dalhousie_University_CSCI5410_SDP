require('dotenv/config')
const express = require('express');
const multer = require('multer');
const aws = require('aws-sdk');
const app = express();
const port = 3000;

const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
});

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '');
    }
});
const upload = multer({ storage }).single('text-file');

// Reference - https://www.youtube.com/watch?v=TtuCCfren_I
app.post('/upload', upload, (req, res) => {
    console.log(req.file);
    let tweetFileName = req.file.originalname;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: tweetFileName,
        Body: req.file.buffer
    }
    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).json(error);
        } else {
            res.status(200).json(data);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is up at PORT: ${port}`);
});