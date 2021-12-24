/* Author: Dhrumil Amish Shah (B00857606) */
import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    root: {
        height: '100vh'
    },
    image: {
        backgroundImage: 'url(https://www.mortgagecalculator.org/images/safety-deposit-box.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    formBackground: {
        backgroundColor: '#FFFFFF',
    },
    form: {
        width: '90%',
        marginTop: theme.spacing(2),
    },
    submit: {
        margin: theme.spacing(1, 0, 2),
    },
    imageSubmit: {
        margin: theme.spacing(1, 0, 4),
    },
    publishMessage: {
        marginTop: '16px',
    },
    circularProgress: {
        color: '#4267B2',
        marginLeft: theme.spacing(4),
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(2),
    }
}));