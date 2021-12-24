import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CssBaseline, Paper, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useStyles from './styles';
import { firestoreDB } from '../../firebaseConfig';
import { collection, query, where, doc, getDocs, updateDoc } from 'firebase/firestore';

export const Profile = () => {
    const classes = useStyles();
    const userDocId = useParams().id;
    const [onlineUsers, setOnlineUsers] = useState("");
    const [loggedInUser, setLoggedInUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    useEffect(async () => {
        const onlineUsersQueryObj = query(collection(firestoreDB, "users"), where("status", "==", "online"));
        const onlineUserQuerySnapshot = await getDocs(onlineUsersQueryObj);
        var allOnlineUsers = "";
        var firstTime = true;
        onlineUserQuerySnapshot.forEach(async (userDoc) => {
            if (userDoc.data().status === "online") {
                if (userDoc.id !== userDocId) {
                    if (firstTime) {
                        allOnlineUsers = "(" + userDoc.data().firstName + " " + userDoc.data().lastName + ")";
                        firstTime = false;
                    } else {
                        allOnlineUsers = allOnlineUsers + ", " + "(" + userDoc.data().firstName + " " + userDoc.data().lastName + ")";
                    }
                } else {
                    setLoggedInUser({
                        firstName: userDoc.data().firstName,
                        lastName: userDoc.data().lastName,
                        email: userDoc.data().email,
                    });
                }
            }
        });
        setOnlineUsers(allOnlineUsers);
    });

    const logout = async () => {
        const userDocRef = doc(firestoreDB, "users", userDocId);
        await updateDoc(userDocRef, {
            status: "offline",
        });
        window.location.href = 'http://localhost:3001/';
    }

    return (
        <div className={`${classes.center} ${classes.body}`}>
            <CssBaseline />
            <Card className={classes.card} component={Paper} elevation={6}>
                <CardHeader
                    avatar={<Avatar className={classes.avatar}>
                        {`${loggedInUser.firstName.substring(0, 1)}${loggedInUser.lastName.substring(0, 1)}`}
                    </Avatar>}
                    title={`${loggedInUser.firstName} ${loggedInUser.lastName}`}
                    subheader={loggedInUser.email} />
                <CardMedia
                    className={classes.image}
                    image="https://source.unsplash.com/random" />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        All logged-in users: {onlineUsers}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="secondary" variant="contained" fullWidth onClick={logout}>
                        Logout
                    </Button>
                </CardActions>
            </Card>
        </div>
    );
}