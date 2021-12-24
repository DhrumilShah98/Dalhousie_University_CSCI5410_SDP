/* Author: Dhrumil Amish Shah (B00857606) */
import React, { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import { CssBaseline, Grid, Paper, TextField, Typography, Button, CircularProgress, Card, CardContent } from '@material-ui/core';
import { useLocation, Link } from 'react-router-dom';
import { publishMessage, pullDelivery, uploadImage } from '../../apis/MessagePassingAPIs';
import useStyles from './styles';

AWS.config.update({
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    sessionToken: process.env.REACT_APP_AWS_SESSION_TOKEN,
});

const documentClient = new AWS.DynamoDB.DocumentClient();

export const Home = () => {
    const [messageData, setMessageData] = useState({ message: '' });
    const [errors, setErrors] = useState({ messageValid: false });

    const [withdrawMoneyData, setWithdrawMoneyData] = useState({ money: 0 });

    const [imageData, setImageData] = useState({ imageLocation: '' });

    const [messagesReceived, setMessagesReceived] = useState([]);
    const userReceivedProps = useLocation().state;

    const classes = useStyles();

    useEffect(() => {
        pullMessages();
    }, []);

    const pullMessages = async () => {
        const safeDepositId = userReceivedProps.safeDepositId;
        const emailId = userReceivedProps.email;
        const sameSafeDepositUsers = {
            TableName: "user",
            FilterExpression: "#safeDepositId = :safeDepositId and not #emailId = :emailId",
            ExpressionAttributeNames: {
                "#safeDepositId": "safeDepositId",
                "#emailId": "email",
            },
            ExpressionAttributeValues: {
                ":safeDepositId": safeDepositId,
                ":emailId": emailId,
            }
        };

        const sameSafeDepositUsersData = await documentClient.scan(sameSafeDepositUsers).promise();
        var msgs = [...messagesReceived];
        for (var i = 0; i < sameSafeDepositUsersData.Items.length; ++i) {
            const userData = {};
            userData["topicName"] = sameSafeDepositUsersData["Items"][i].topicName;
            userData["userId"] = userReceivedProps.userId;
            const receivedMessagesData = await pullDelivery(userData);
            msgs = msgs.concat(receivedMessagesData.data.payload);
        }
        console.log(msgs);
        setMessagesReceived(msgs);
    };

    const uploadImageData = async () => {
        const imageFormData = new FormData();
        console.log(userReceivedProps.userId);
        imageFormData.append("userId", userReceivedProps.userId);
        imageFormData.append("imageLocation", imageData.imageLocation);
        try {
            await uploadImage(imageFormData);
        } catch (err) {
            console.log(err);
        }
    }

    const fieldsValid = () => {
        if (errors.messageValid) {
            return true;
        } else {
            return false;
        }
    }

    const validate = (e) => {
        switch (e.target.name) {
            case 'message':
                if (e.target.value === "" || e.target.value === null) {
                    errors["message"] = "Message is required."
                    errors["messageValid"] = false;
                } else {
                    errors["message"] = "";
                    errors["messageValid"] = true;
                }
                break;
            default:
                break;
        }
        setErrors(errors);
    };

    const onChange = (e) => {
        validate(e);
        setMessageData({
            ...messageData,
            [e.target.name]: e.target.value
        });
    };

    const onWithdrawMoneyChange = (e) => {
        setWithdrawMoneyData({
            ...withdrawMoneyData,
            [e.target.name]: e.target.value
        });
    };

    const onImageChange = (e) => {
        const imageFile = e.target.files[0];
        setImageData({
            ...imageData,
            [e.target.name]: imageFile
        });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (fieldsValid()) {
            const user = {}
            user["topicName"] = userReceivedProps.topicName;
            user["message"] = `${userReceivedProps.firstName} ${userReceivedProps.lastName}: ${messageData.message}`;
            const publishMessageData = await publishMessage(user);
            if (publishMessageData.data.success) {
                console.log("Message published successfully.");
                console.log(publishMessageData.data.message);
                setMessageData({ message: '' });
                setErrors({ messageValid: false });
            }
        }
    };

    const onImageDataSubmit = async (e) => {
        e.preventDefault();
        uploadImageData();
    }

    const onWithdrawMoneySubmit = async (e) => {
        e.preventDefault();
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={12} sm={4} md={7}>
                <iframe title="Google Data Studio Charts" width="100%" height="50%" src="https://datastudio.google.com/embed/reporting/d9501b3d-2b89-4c1a-a692-8ea71f8069ac/page/p_k4holg83pc" />
                <div style={{ marginTop: '16px', marginLeft: '32px', marginRight: '32px' }}>
                    <Typography component="h4" variant="h4" fontWeight="fontWeightBold">
                        Logged In As: {userReceivedProps.firstName} {userReceivedProps.lastName}
                    </Typography>
                    <Typography component="p" variant="p" fontWeight="fontWeightBold">
                        SafeDeposit Id: {userReceivedProps.safeDepositId}
                    </Typography>
                    <Typography component="p" variant="p" fontWeight="fontWeightBold">
                        SafeDeposit Amount: 5000
                    </Typography>
                    <form onSubmit={onWithdrawMoneySubmit} noValidate>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="withdrawMoney"
                            type="number"
                            name="withdrawMoney"
                            label="Enter amount to withdraw"
                            variant="outlined"
                            required
                            value={withdrawMoneyData.money}
                            onChange={onWithdrawMoneyChange}
                        />
                        <Button color="secondary" variant="contained" type="submit">
                            Withdraw Money
                        </Button>
                    </form>
                </div>
            </Grid>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.formBackground}>
                <div className={classes.paper}>
                    <Button color="secondary" variant="contained" type="submit">
                        <Link to={"/login1"} style={{ color: "#FFFFFF" }}>Logout</Link>
                    </Button>
                    <form onSubmit={onImageDataSubmit} className={classes.form} autoComplete="off" noValidate method="POST" enctype="multipart/form-data">
                        <Typography component="h4" variant="h4" fontWeight="fontWeightBold">
                            Upload Image To Publish Messages
                        </Typography>
                        <div style={{ marginTop: '8px' }}>
                            <input
                                fullWidth
                                id="imageLocation"
                                type="file"
                                name="imageLocation"
                                accept="image/*"
                                required
                                onChange={onImageChange} />
                        </div>
                        <Button className={classes.imageSubmit} color="secondary" variant="contained" type="submit">
                            Upload Image
                        </Button>
                    </form>
                    <Typography component="h4" variant="h4" fontWeight="fontWeightBold">
                        Message Other Users
                    </Typography>
                    <form onSubmit={onSubmit} className={classes.form} noValidate>
                        <div className={classes.publishMessage}>Publish message to topic: {userReceivedProps.topicName}</div>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="message"
                            type="text"
                            name="message"
                            label="Type your message here"
                            variant="outlined"
                            required
                            value={messageData.message}
                            onChange={onChange}
                            error={errors["message"] ? true : false}
                            helperText={errors["message"]}
                        />
                        <Button disabled={!fieldsValid()} className={classes.submit} color="secondary" variant="contained" type="submit">
                            Publish Message From {userReceivedProps.firstName}
                        </Button>
                    </form>
                </div>
                {!messagesReceived.length ?
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography>Waiting for new messages ... :) </Typography>
                        <CircularProgress className={classes.circularProgress} /></div> :
                    (<Grid className={classes.container}
                        container alignItems="center"
                        spacing={1}>
                        {messagesReceived.map((messageReceived, index) => {
                            return <Grid item xs={12} sm={12} md={12} lg={12} key={index}>
                                <div style={{ marginLeft: "16px", marginRight: "16px" }}>
                                    <Card elevation={6} component={Paper}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 14 }} color="primary" gutterBottom>
                                                {messageReceived.split(':')[0]}
                                            </Typography>
                                            <Typography variant="h5" component="div">
                                                {messageReceived.split(':')[1]}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            </Grid>
                        })}
                    </Grid>)}
            </Grid>
        </Grid>
    );
};