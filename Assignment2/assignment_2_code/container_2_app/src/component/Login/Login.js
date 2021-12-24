import React, { useState } from 'react';
import { CssBaseline, Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import useStyles from './styles';
import { firestoreDB } from '../../firebaseConfig';
import { collection, query, where, doc, getDocs, updateDoc } from 'firebase/firestore';

export const Login = () => {
    const classes = useStyles();

    const [userData, updateUserData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        emailValid: false,
        passwordValid: false,
    });

    const fieldsValid = () => {
        if (errors.emailValid && errors.passwordValid) {
            return true;
        } else {
            return false;
        }
    }

    const validate = (e) => {
        switch (e.target.name) {
            case 'email':
                // Email regex source - https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
                const isEmailCorrect = RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(e.target.value);
                if (e.target.value === "" || e.target.value === null) {
                    errors["email"] = "Email name is required."
                    errors["emailValid"] = false;
                } else if (!isEmailCorrect) {
                    errors["email"] = "Please enter a valid email address."
                    errors["emailValid"] = false;
                } else {
                    errors["email"] = ""
                    errors["emailValid"] = true;
                }
                break;
            case 'password':
                const isPasswordCorrect = RegExp(/^[A-Za-z\d@$!%*#?&_]+$/).test(e.target.value);
                if (e.target.value === "" || e.target.value === null) {
                    errors["password"] = "Password is required."
                    errors["passwordValid"] = false;
                } else if (e.target.value.length < 8) {
                    errors["password"] = "Password must be at least 8 characters long."
                    errors["passwordValid"] = false;
                } else if (!isPasswordCorrect) {
                    errors["password"] = "Password can only have alpha-numeric and special characters."
                    errors["passwordValid"] = false;
                } else {
                    errors["password"] = ""
                    errors["passwordValid"] = true;
                }
                break;
            default:
                break;
        }
        setErrors(errors);
    };

    const onChange = (e) => {
        validate(e);
        updateUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    const loginUser = async () => {
        try {
            const queryObj = query(collection(firestoreDB, "users"), where("email", "==", userData.email));
            const querySnapshot = await getDocs(queryObj);
            var userExists = false;
            querySnapshot.forEach(async (userDoc) => {
                if (userData.password === userDoc.data().password) {
                    userExists = true;
                    console.log("User found!");
                    console.log(userDoc.id, " => ", userDoc.data());
                    const userDocRef = doc(firestoreDB, "users", userDoc.id);
                    await updateDoc(userDocRef, {
                        status: "online",
                    });
                    window.location.href = 'http://localhost:3002/' + userDoc.id;
                } else {
                    userExists = false;
                }
            });
            if (!userExists) {
                console.error("User not found!");
            }
        } catch (e) {
            console.error("Error reading user: ", e);
        }
    };

    const onSubmit = (e) => {
        e.preventDefault();
        loginUser();
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.formBackground}>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h3" fontWeight="fontWeightBold">
                        Sign In
                    </Typography>
                    <form onSubmit={onSubmit} className={classes.form} noValidate>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="email"
                            type="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            required
                            value={userData.email}
                            onChange={onChange}
                            error={errors["email"] ? true : false}
                            helperText={errors["email"]}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="password"
                            type="password"
                            name="password"
                            label="Password"
                            variant="outlined"
                            required
                            value={userData.password}
                            onChange={onChange}
                            error={errors["password"] ? true : false}
                            helperText={errors["password"]}
                        />
                        <Button disabled={!fieldsValid()} className={classes.submit} color="secondary" variant="contained" fullWidth type="submit">
                            Submit
                        </Button>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};