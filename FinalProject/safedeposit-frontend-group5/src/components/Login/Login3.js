/* Author: Dhrumil Amish Shah (B00857606) */
import React, { useState } from 'react';
import { CssBaseline, Grid, Paper, TextField, Typography, Button } from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useNavigate, useLocation } from 'react-router-dom';
import { decryptCipher, generateEncryptedCipher } from './LoginBackend';
import useStyles from './styles';

const randomKey = Math.floor(Math.random() * 5) + 1

const encryptedCipher = generateEncryptedCipher();
const decryptedCipher = decryptCipher(encryptedCipher, randomKey);

export const Login3 = () => {
    const [userData, updateUserData] = useState({
        decryptedCipherText: '',
    });
    const [errors, setErrors] = useState({
        decryptedCipherTextValid: false,
    });
    const userReceivedProps = useLocation().state;
    const navigate = useNavigate();
    const classes = useStyles();

    const fieldsValid = () => {
        if (errors.decryptedCipherTextValid) {
            return true;
        } else {
            return false;
        }
    }

    const validate = (e) => {
        switch (e.target.name) {
            case 'decryptedCipherText':
                if (e.target.value === "" || e.target.value === null) {
                    errors["decryptedCipherText"] = "Decrypted cipher text is required."
                    errors["decryptedCipherTextValid"] = false;
                } else if (e.target.value !== decryptedCipher) {
                    errors["decryptedCipherText"] = "Incorrect decrypted cipher text."
                    errors["decryptedCipherTextValid"] = false;
                } else {
                    errors["decryptedCipherText"] = "";
                    errors["decryptedCipherTextValid"] = true;
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
            console.log('Login success!');
            delete userReceivedProps['securityAnswer'];
            delete userReceivedProps['securityAnswerKey'];
            console.log(userReceivedProps);
            navigate('/home', { state: userReceivedProps });
        }
    };

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.formBackground}>
                <div className={classes.paper}>
                    <Typography component="h1" variant="h4" fontWeight="fontWeightBold">
                        SafeDeposit Login Page 3 - 3
                    </Typography>
                    <form onSubmit={onSubmit} className={classes.form} noValidate>
                        <div className={classes.securityQuestion}>Decrypt Ceaser Cipher:&nbsp;<span style={{ fontWeight: "bold" }}>{encryptedCipher}</span> | Key = <ArrowForwardIcon /> {randomKey} </div>
                        <TextField
                            fullWidth
                            margin="normal"
                            id="decryptedCipherText"
                            type="text"
                            name="decryptedCipherText"
                            label="Decrypted Cipher Text"
                            variant="outlined"
                            required
                            value={userData.decryptedCipherText}
                            onChange={onChange}
                            error={errors["decryptedCipherText"] ? true : false}
                            helperText={errors["decryptedCipherText"]}
                        />
                        <Button disabled={!fieldsValid()} className={classes.submit} color="secondary" variant="contained" fullWidth type="submit">
                            Login
                        </Button>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};