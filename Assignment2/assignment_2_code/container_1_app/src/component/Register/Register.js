import React, { useState } from 'react';
import { CssBaseline, Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import useStyles from './styles';
import { firestoreDB } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const Register = () => {
    const classes = useStyles();

    const [userData, updateUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        firstNameValid: false,
        lastNameValid: false,
        emailValid: false,
        passwordValid: false,
        confirmPasswordValid: false,
    });

    const fieldsValid = () => {
        if (errors.firstNameValid && errors.lastNameValid && errors.emailValid && errors.passwordValid && errors.confirmPasswordValid) {
            return true;
        } else {
            return false;
        }
    }

    const validate = (e) => {
        switch (e.target.name) {
            case 'firstName':
                const isFNameCorrect = RegExp(/^[A-Za-z\d]+$/).test(e.target.value);
                if (e.target.value === "" || e.target.value === null) {
                    errors["firstName"] = "First name is required."
                    errors["firstNameValid"] = false;
                } else if (!isFNameCorrect) {
                    errors["firstName"] = "First name can only have alpha-numeric characters."
                    errors["firstNameValid"] = false;
                } else {
                    errors["firstName"] = "";
                    errors["firstNameValid"] = true;
                }
                break;
            case 'lastName':
                const isLNameCorrect = RegExp(/^[A-Za-z\d]+$/).test(e.target.value);
                if (e.target.value === "" || e.target.value === null) {
                    errors["lastName"] = "Last name is required."
                    errors["lastNameValid"] = false;
                } else if (!isLNameCorrect) {
                    errors["lastName"] = "Last name can only have alpha-numeric characters."
                    errors["lastNameValid"] = false;
                } else {
                    errors["lastName"] = "";
                    errors["lastNameValid"] = true;
                }
                break;
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
            case 'confirmPassword':
                if (e.target.value === "" || e.target.value === null) {
                    errors["confirmPassword"] = "Confirm password is required."
                    errors["confirmPasswordValid"] = false;
                } else if (e.target.value !== userData.password) {
                    errors["confirmPassword"] = "Confirm password must match the password field."
                    errors["confirmPasswordValid"] = false;
                } else {
                    errors["confirmPassword"] = ""
                    errors["confirmPasswordValid"] = true;
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

    const storeDataInFirestore = async () => {
        try {
            const docRef = await addDoc(collection(firestoreDB, "users"), {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                status: 'offline',
                timestamp: serverTimestamp(),
            });
            console.log("Document written with ID: ", docRef.id);
            updateUserData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
            });
            window.location.href = 'http://localhost:3001/';
        } catch (e) {
            console.error("Error adding user: ", e);
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (fieldsValid()) {
            storeDataInFirestore();
        };
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.formBackground}>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h3" fontWeight="fontWeightBold">
                        Sign Up
                    </Typography>
                    <form onSubmit={onSubmit} className={classes.form} noValidate>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="firstName"
                            type="text"
                            name="firstName"
                            label="First Name"
                            variant="outlined"
                            required
                            value={userData.firstName}
                            onChange={onChange}
                            error={errors["firstName"] ? true : false}
                            helperText={errors["firstName"]}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            id="lastName"
                            type="text"
                            name="lastName"
                            label="Last Name"
                            variant="outlined"
                            required
                            value={userData.lastName}
                            onChange={onChange}
                            error={errors["lastName"] ? true : false}
                            helperText={errors["lastName"]}
                        />
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
                        <TextField
                            fullWidth
                            margin="normal"
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            label="Confirm Password"
                            variant="outlined"
                            required
                            value={userData.confirmPassword}
                            onChange={onChange}
                            error={errors["confirmPassword"] ? true : false}
                            helperText={errors["confirmPassword"]}
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