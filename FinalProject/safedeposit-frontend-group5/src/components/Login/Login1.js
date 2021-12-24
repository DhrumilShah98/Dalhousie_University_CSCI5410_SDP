/* Author: Dhrumil Amish Shah (B00857606) */
import React, { useState } from 'react';
import { CssBaseline, Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { performLogin1 } from './LoginBackend';
import useStyles from './styles';

export const Login1 = () => {
    const [userData, updateUserData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        emailValid: false,
        passwordValid: false
    });
    const navigate = useNavigate();
    const classes = useStyles();

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

    const onSubmit = async (e) => {
        e.preventDefault();
        if (fieldsValid()) {
            const userReceived = await performLogin1(userData);
            if (userReceived) {
                navigate('/login2', { state: userReceived });
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
                        SafeDeposit Login Page 1 - 3
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
                            Next
                        </Button>
                        New User? <Link to={"/"}>Register</Link>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};