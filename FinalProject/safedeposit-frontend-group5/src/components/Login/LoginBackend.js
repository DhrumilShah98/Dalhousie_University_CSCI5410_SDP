/* Author: Dhrumil Amish Shah (B00857606) */
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { firebaseDb } from '../../_firebase';
dotenv.config();

AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
});

export const performLogin1 = async (user) => {
    const documentClient = new AWS.DynamoDB.DocumentClient();
    var userParams = {
        TableName: "user",
        FilterExpression: "email=:emailId",
        ExpressionAttributeValues: {
            ":emailId": user.email
        }
    };
    const userReceived = await documentClient.scan(userParams).promise();
    const userExists = userReceived.Items.length > 0 && userReceived.Items[0].password === user.password;
    if (userExists) {
        delete userReceived.Items[0]['password'];
        return userReceived.Items[0];
    } else {
        return null;
    }
};

export const performLogin2 = async (user) => {
    const retrivedSnapshot = await firebaseDb.collection('userSecurityQuestionsAnswers').where('email', '==', user.email).get();
    if (!retrivedSnapshot.empty) {
        var isSecurityAnswerCorrect = false;
        retrivedSnapshot.forEach(doc => {
            if (user.securityAnswer === doc.data()[user.securityAnswerKey]) {
                isSecurityAnswerCorrect = true;
                user['firebaseId'] = doc.data()['id'];
                user['answer1'] = doc.data()['answer1'];
                user['answer2'] = doc.data()['answer2'];
                user['answer3'] = doc.data()['answer3'];
            }
        });
        if (isSecurityAnswerCorrect) {
            return user;
        } else {
            return null;
        }
    } else {
        return null;
    }
};

export const decryptCipher = (encryptedCipher, randomKey) => {
    const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var decryptedCipher = '';
    for (var i = 0; i < encryptedCipher.length; ++i) {
        var index = alphabets.indexOf(encryptedCipher[i]) - randomKey;
        if (index < 0) {
            index = index + 26;
        }
        decryptedCipher = decryptedCipher + alphabets[index];
    }
    return decryptedCipher;
};

export const generateEncryptedCipher = () => {
    const charString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length = 1;
    var result = '';
    for (var i = length; i > 0; --i) {
        result += charString[Math.floor(Math.random() * charString.length)];
    }
    return result;
};