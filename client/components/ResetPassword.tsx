import React, { FC, useState } from 'react';
import { Paper, TextField, makeStyles, Typography, Button, Popover } from '@material-ui/core';
import { useForm } from "react-hook-form";
import useApi from "../hooks/useApi";
import { useHistory, useParams } from 'react-router-dom';

const ResetPassword: FC = () => {

    const useStyle = makeStyles({
        body: {
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        content: {
            width: 280,
            padding: 10
        },
        field: {
            display: 'block',
            marginTop: 20,
            "& div": {
                width: "100%"
            }
        },
        popoverGreen: {
            backgroundColor: '#2CFA67',
            color: '#fff'
        },
        popoverRed: {
            backgroundColor: '#f44336',
            color: '#fff'
        }
    });

    const { token, userId } = useParams();

    const history = useHistory();
    const api = useApi();

    const { register, handleSubmit, errors, setError } = useForm();
    const onSubmit = async ({password, confirmPassword}) => {
        if (password !== confirmPassword) {
            setError('confirmPassword', {
                type: "password",
                message: "Egaliser les mots de passe"
            });
        } else {
            try {
                await api.post('auth/resetPassword', {
                    password,
                    token,
                    userId
                });
                setOpen(true);
                setPopoverStatus(200);
            } catch (err) {
                setOpen(true);
                setPopoverStatus(404);
            }
        }
    }

    const [open, setOpen] = useState(false);
    const [popoverStatus, setPopoverStatus] = useState(0);
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const id = open ? 'simple-popover' : undefined;

    const onConnect = () => {
        history.push('/connexion');
    }
    const classes = useStyle();
    return (
        <div className={classes.body}>
            <Paper
                className={classes.content}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        className={classes.field}
                        name="password"
                        type="password"
                        label={<Typography>Mot de passe</Typography>}
                        inputRef={register({ required: true })}
                        error={errors.password}
                        helperText={errors.password ? <Typography>Le mot de passe est obligatoire</Typography> : null}
                    />
                    <TextField
                        className={classes.field}
                        name="confirmPassword"
                        type="password"
                        label={<Typography>Confirmation du mot de passe</Typography>}
                        inputRef={register({ required: true })}
                        error={errors.confirmPassword}
                        helperText={errors.confirmPassword ? <Typography>La confirmation du mot de passe est obligatoire et doit correspondre au mot de passe</Typography> : null}
                    />
                    <Button
                        className={classes.field}
                        color="primary"
                        variant="outlined"
                        type="submit"
                    >
                        Changer
                    </Button>
                    <Button
                        color="primary"
                        className={classes.field}
                        onClick={onConnect}
                    >Retour à la connexion</Button>
                </form>
            </Paper>
            <Popover
                id={id}
                open={open}
                onClose={handleClose}
                
            >
                {popoverStatus === 200 ? 
                <Typography className={classes.popoverGreen}>Votre mot de passe a été changé avec succès</Typography> : 
                (popoverStatus === 404 ?
                <Typography className={classes.popoverRed}>Aucun compte actif trouvé</Typography> :
                null)    
            }   
            </Popover>
        </div>
    );
};

export default ResetPassword;