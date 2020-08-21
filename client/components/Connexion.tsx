import React, { FC } from 'react';
import useAuth from "../hooks/useAuth";
import { Paper, TextField, Button, makeStyles, Typography} from '@material-ui/core';
import { useForm } from "react-hook-form";
import { useHistory } from 'react-router-dom';

const Connexion: FC = () => {

    const useStyles = makeStyles({
        body: {
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        content: {
            width: 300,
            padding: 30
        },
        field: {
            display: 'block',
            marginBottom: 30,
            "& div": {
                width: "100%"
            }
        }
    });

    const history = useHistory();

    const { register, handleSubmit, errors, setError } = useForm();

    const classes = useStyles();
    const auth = useAuth();

    const onSubmit = ({email, password}) => {
        auth.login(email, password);
    }

    const onReset = () => {
        history.push('/resetPassword');
    }

    const onCreate = () => {
        history.push('/addUser');
    }

    return (
        <div className={classes.body}>
            <Paper className={classes.content}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        className={classes.field}
                        name="email"
                        label={<Typography>Email</Typography>}
                        inputRef={register({ required: true, pattern:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })}
                        error={errors.email}
                        helperText={errors.email ? <Typography>Le mail est obligatoire en format mail -@-.-</Typography> : null}
                    />
                    <TextField
                        className={classes.field}
                        name="password"
                        type="password"
                        label={<Typography>Mot de passe</Typography>}
                        inputRef={register({ required: true })}
                        error={errors.password}
                        helperText={errors.password ? <Typography>Le mot de passe est obligatoire</Typography> : null}
                    />
                    <Button
                        className={classes.field}
                        type="submit"
                        variant="outlined"
                        color="primary"
                    >Se connecter</Button>
                    <Button
                        className={classes.field}
                        color="primary"
                        onClick={onReset}
                    >Mot de passe oublié</Button>
                    <Button
                        className={classes.field}
                        color="primary"
                        onClick={onCreate}
                    >Créer un compte</Button>
                </form>
            </Paper>
        </div>
    );
};

export default Connexion;