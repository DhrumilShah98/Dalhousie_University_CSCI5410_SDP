const aws = require('aws-sdk');
const s3 = new aws.S3();
const comprehend = new aws.Comprehend({ apiVersion: '2017-11-27', region: 'us-east-1', });

// Reference - https://www.youtube.com/watch?v=S7L-bUPjiRU
// Reference - https://www.youtube.com/watch?v=U8KkldmP3Bk&t=189s
// Reference - https://stackoverflow.com/questions/65188036/how-to-correctly-access-the-amazon-comprehend-api-with-javascript-callback
const main = async (event) => {
    console.log(`Event: ${event}`);
    const object = event.Records[0].s3;
    const bucket = object.bucket.name;
    const file = object.object.key;
    console.log(`Bucket name: ${bucket}, File: ${file}`);
    await new Promise((resolve, reject) => {
        const s3GetObjectParams = { Bucket: bucket, Key: file, };
        s3.getObject(s3GetObjectParams, async (err, result) => {
            if (err) {
                console.log(err, err.stack);
            } else {
                console.log(`Result: ${result}`);
                const fileContents = result.Body.toString();
                const SPLIT_TWEET_REGEX = /RT @\w+:/;
                const tweets = fileContents.split(SPLIT_TWEET_REGEX);
                var sentimentArray = [];
                for (let index = 0; index < tweets.length; ++index) {
                    const tweet = tweets[index];
                    try {
                        const comprehendParams = { LanguageCode: 'en', Text: tweet, };
                        const comprehendPromise = await comprehend.detectSentiment(comprehendParams).promise();
                        const sentimentObject = {
                            tweet: tweet,
                            sentiment: comprehendPromise.Sentiment,
                            sentimentScore: comprehendPromise.SentimentScore,
                        };
                        sentimentArray.push(sentimentObject);
                        console.log(sentimentObject);
                    } catch (err) {
                        console.log(err, err.stack);
                    }
                };
                console.log(`Output:`);
                const bucketName = "twitterdataoutputb00857606";
                const fileName = "tweetsAnalyzed.json";
                const s3UploadFileParams = { Bucket: bucketName, Key: fileName, Body: JSON.stringify(sentimentArray) };
                try {
                    await s3.upload(s3UploadFileParams).promise();
                    console.log(`Output in file ${fileName} and bucket ${bucketName}.`);
                } catch (err) {
                    console.log(err, err.stack);
                }
            };
        });
    });
};

exports.handler = main;