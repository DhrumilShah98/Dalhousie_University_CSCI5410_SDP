/* Author: Dhrumil Amish Shah (B00857606) */
import { v4 as uuidv4 } from 'uuid';
import AWS from 'aws-sdk';
import dotenv from 'dotenv';
import { firebaseDb } from '../../_firebase';
import { createTopic } from '../../apis/MessagePassingAPIs';
dotenv.config();

AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
});

const updateSafeDepositBox = async (lastSafeDepositBox, documentClient) => {
    var updatedSafeDepositEntryParams = {
        TableName: "safeDeposit",
        Key: {
            safeDepositId: lastSafeDepositBox.safeDepositId
        },
        UpdateExpression: "set totalUser = :tu",
        ExpressionAttributeValues: {
            ":tu": lastSafeDepositBox.totalUser + 1
        },
        ReturnValues: "UPDATED_NEW"
    };
    await documentClient.update(updatedSafeDepositEntryParams).promise();
    return lastSafeDepositBox.safeDepositId;
}

const updateUserTopicName = async (user, documentClient) => {
    var updatedUserEntryParams = {
        TableName: "user",
        Key: {
            userId: user.userId
        },
        UpdateExpression: "set topicName = :tn",
        ExpressionAttributeValues: {
            ":tn": user.topicName
        },
        ReturnValues: "UPDATED_NEW"
    };
    await documentClient.update(updatedUserEntryParams).promise();
    return user.userId;
}

const newUserCreation = async (user, randomSafeDepositID, documentClient) => {
    const userEntryId = uuidv4().toString();
    const userEntry = {
        userId: userEntryId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        safeDepositId: randomSafeDepositID,
    }
    await documentClient.put({ TableName: "user", Item: userEntry }).promise();
    return userEntryId;
}

const newSafeDepositBoxCreation = async (documentClient) => {
    const randomSafeDepositID = uuidv4().toString();
    const safeDepositEntry = {
        safeDepositId: randomSafeDepositID,
        totalUser: 1,
        amount: 5000
    }
    await documentClient.put({ TableName: "safeDeposit", Item: safeDepositEntry }).promise();
    return randomSafeDepositID;
}

export const performRegistration = async (user) => {
    var randomSafeDepositID = '';
    var userEntryID = '';
    const documentClient = new AWS.DynamoDB.DocumentClient();
    const dynamoDbData = await documentClient.scan({ TableName: "safeDeposit" }).promise();
    if (dynamoDbData.Items.length > 0) {
        var isNewBoxNeeded = true;
        for (var i = 0; i < dynamoDbData.Items.length; ++i) {
            const currentSafeDepositBox = dynamoDbData.Items[i];
            if (currentSafeDepositBox.totalUser !== 3) {
                isNewBoxNeeded = false;
                randomSafeDepositID = await updateSafeDepositBox(currentSafeDepositBox, documentClient);
                userEntryID = await newUserCreation(user, randomSafeDepositID, documentClient);
            }
        }
        if (isNewBoxNeeded) {
            randomSafeDepositID = await newSafeDepositBoxCreation(documentClient);
            userEntryID = await newUserCreation(user, randomSafeDepositID, documentClient);
        }
    } else {
        randomSafeDepositID = await newSafeDepositBoxCreation(documentClient);
        userEntryID = await newUserCreation(user, randomSafeDepositID, documentClient);
    }
    console.log('Registration performed successfully. (User ID | Safe Deposit ID)')
    console.log(`${userEntryID} ${randomSafeDepositID}`);

    await firebaseDb.collection('userSecurityQuestionsAnswers').add({
        id: uuidv4().toString(),
        answer1: user.answer1,
        answer2: user.answer2,
        answer3: user.answer3,
        email: user.email,
        userId: userEntryID,
        safeDepositId: randomSafeDepositID
    });

    user["userId"] = userEntryID;
    const createTopicData = await createTopic(user);
    if (createTopicData.data.success) {
        console.log(createTopicData.data.message);
        user["topicName"] = createTopicData.data.payload;
        console.log(user);
    }
    await updateUserTopicName(user, documentClient);
    return true;
};