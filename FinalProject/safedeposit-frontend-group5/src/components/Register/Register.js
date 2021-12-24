/* Author: Dhrumil Amish Shah (B00857606) */
import React, { useState } from 'react';
import { CssBaseline, Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { Link, useNavigate } from 'react-router-dom';
import { performRegistration } from './RegisterBackend';
import useStyles from './styles';

export const Register = () => {
    const [userData, updateUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        answer1: '',
        answer2: '',
        answer3: '',
    });
    const [errors, setErrors] = useState({
        firstNameValid: false,
        lastNameValid: false,
        emailValid: false,
        passwordValid: false,
        confirmPasswordValid: false,
        answer1Valid: false,
        answer2Valid: false,
        answer3Valid: false,
    });
    const navigate = useNavigate();
    const classes = useStyles();

    const fieldsValid = () => {
        if (errors.firstNameValid &&
            errors.lastNameValid &&
            errors.emailValid &&
            errors.passwordValid &&
            errors.confirmPasswordValid &&
            errors.answer1Valid &&
            errors.answer2Valid &&
            errors.answer3Valid) {
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
            case 'answer1':
                const isAnswer1Correct = RegExp(/^[A-Za-z\d]+$/).test(e.target.value);
                if (e.target.value === "" || e.target.value === null) {
                    errors["answer1"] = "Answer 1 is required."
                    errors["answer1Valid"] = false;
                } else if (!isAnswer1Correct) {
                    errors["answer1"] = "Answer 1 can only have alpha-numeric characters."
                    errors["answer1Valid"] = false;
                } else {
                    errors["answer1"] = "";
                    errors["answer1Valid"] = true;
                }
                break;
            case 'answer2':
                const isAnswer2Correct = RegExp(/^[A-Za-z\d]+$/).test(e.target.value);
                if (e.target.value === "" || e.target.value === null) {
                    errors["answer2"] = "Answer 2 is required."
                    errors["answer2Valid"] = false;
                } else if (!isAnswer2Correct) {
                    errors["answer2"] = "Answer 2 can only have alpha-numeric characters."
                    errors["answer2Valid"] = false;
                } else {
                    errors["answer2"] = "";
                    errors["answer2Valid"] = true;
                }
                break;
            case 'answer3':
                const isAnswer3Correct = RegExp(/^[A-Za-z\d]+$/).test(e.target.value);
                if (e.target.value === "" || e.target.value === null) {
                    errors["answer3"] = "Answer 3 is required."
                    errors["answer3Valid"] = false;
                } else if (!isAnswer3Correct) {
                    errors["answer3"] = "Answer 3 can only have alpha-numeric characters."
                    errors["answer3Valid"] = false;
                } else {
                    errors["answer3"] = "";
                    errors["answer3Valid"] = true;
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

    const onSubmit = async (e) => {
        e.preventDefault();
        if (fieldsValid()) {
            const success = await performRegistration(userData);
            if (success) {
                navigate('/login1');
            }
        }
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.formBackground}>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h4" fontWeight="fontWeightBold">
                        <PersonAddIcon fontSize='medium' /> | SafeDeposit Registration
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
                            helperText={errors["firstName"]} />
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
                            helperText={errors["lastName"]} />
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
                            helperText={errors["email"]} />
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
                            helperText={errors["password"]} />
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
                            helperText={errors["confirmPassword"]} />
                        <div className={classes.securityQuestion}>Question 1: What is your best friend's first name? *</div>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="answer1"
                            type="text"
                            name="answer1"
                            label="Answer 1"
                            variant="outlined"
                            required
                            value={userData.answer1}
                            onChange={onChange}
                            error={errors["answer1"] ? true : false}
                            helperText={errors["answer1"]} />
                        <div className={classes.securityQuestion}>Question 2: What is your birth year? *</div>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="answer2"
                            type="text"
                            name="answer2"
                            label="Answer 2"
                            variant="outlined"
                            required
                            value={userData.answer2}
                            onChange={onChange}
                            error={errors["answer2"] ? true : false}
                            helperText={errors["answer2"]} />
                        <div className={classes.securityQuestion}>Question 3: What is your mother's maiden name? *</div>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="answer3"
                            type="text"
                            name="answer3"
                            label="Answer 3"
                            variant="outlined"
                            required
                            value={userData.answer3}
                            onChange={onChange}
                            error={errors["answer3"] ? true : false}
                            helperText={errors["answer3"]} />
                        <Button disabled={!fieldsValid()} className={classes.submit} color="secondary" variant="contained" fullWidth type="submit">
                            Register
                        </Button>
                        <div className={classes.loginLink}>Already have an account? <Link to={"/login1"}>Login</Link></div>
                            <Button className={classes.submit} color="secondary" variant="contained" fullWidth type="submit">
                                <Link to={"/online-support"} style={{ color: "#FFFFFF" }}>SafeDeposit Bot</Link>
                            </Button>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};