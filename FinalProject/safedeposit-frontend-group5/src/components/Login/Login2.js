/* Author: Dhrumil Amish Shah (B00857606) */
import React, { useState } from 'react';
import { CssBaseline, Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { performLogin2 } from './LoginBackend';
import useStyles from './styles';

const securityQuestions = [
    { index: '0', question: 'What is your best friend\'s first name?' },
    { index: '1', question: 'What is your birth year?' },
    { index: '2', question: 'What is your mother\'s maiden name?' }
];
const randomSecurityQuestionIndex = Math.floor(Math.random() * securityQuestions.length);

export const Login2 = () => {
    const [userData, updateUserData] = useState({
        securityAnswer: '',
        securityAnswerKey: `answer${(securityQuestions[randomSecurityQuestionIndex].index++)}`
    });
    const [errors, setErrors] = useState({
        securityAnswerValid: false
    });
    const navigate = useNavigate();
    const userReceivedProps = useLocation().state;
    const classes = useStyles();

    const fieldsValid = () => {
        if (errors.securityAnswerValid) {
            return true;
        } else {
            return false;
        }
    }

    const validate = (e) => {
        switch (e.target.name) {
            case 'securityAnswer':
                const isSecurityAnswerCorrect = RegExp(/^[A-Za-z\d]+$/).test(e.target.value);
                if (e.target.value === "" || e.target.value === null) {
                    errors["securityAnswer"] = "Security answer is required."
                    errors["securityAnswerValid"] = false;
                } else if (!isSecurityAnswerCorrect) {
                    errors["securityAnswer"] = "Security answer can only have alpha-numeric characters."
                    errors["securityAnswerValid"] = false;
                } else {
                    errors["securityAnswer"] = "";
                    errors["securityAnswerValid"] = true;
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
            userReceivedProps['securityAnswer'] = userData.securityAnswer;
            userReceivedProps['securityAnswerKey'] = userData.securityAnswerKey;
            const userReceived = await performLogin2(userReceivedProps);
            if (userReceived) {
                navigate('/login3', { state: userReceived });
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
                        SafeDeposit Login Page 2 - 3
                    </Typography>
                    <form onSubmit={onSubmit} className={classes.form} noValidate>
                        <div className={classes.securityQuestion}>Question: {securityQuestions[randomSecurityQuestionIndex].question}</div>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="securityAnswer"
                            type="text"
                            name="securityAnswer"
                            label="Security Answer"
                            variant="outlined"
                            required
                            value={userData.securityAnswer}
                            onChange={onChange}
                            error={errors["securityAnswer"] ? true : false}
                            helperText={errors["securityAnswer"]}
                        />
                        <Button disabled={!fieldsValid()} className={classes.submit} color="secondary" variant="contained" fullWidth type="submit">
                            Next
                        </Button>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};