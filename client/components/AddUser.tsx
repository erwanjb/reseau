import React, { FC, useCallback, useState } from 'react';
import { Paper, Typography, TextField, Button, makeStyles, FormHelperText, Avatar } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import useApi from "../hooks/useApi";

interface FileReaderEventTarget extends EventTarget {
    result: Buffer
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage():string;
}

const AddUser: FC = () => {

    const api = useApi();

    const [namePicture, setNamePicture] = useState('');
    const [errorPicture, setErrorPicture] = useState(false);
    const [srcPicture, setSrcPicture] = useState('');

    const useStyles = makeStyles({
        body: {
            marginTop: 30,
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
        drop: {
            marginTop: 20,
            border: "1px solid #05647A",
            backgroundColor: '#5F8883',
            borderRadius: 12,
            color: "#fff",
            padding: 5
        },
        red: {
            color: '#f44336'
        },
        white: {
            color: "#fff"
        },
        label: {
            width: 260,
            display: 'flex'
        }
    })

    const classes = useStyles();

    const { register, handleSubmit, errors, setError } = useForm();

    const onDrop = useCallback(acceptedFiles => {
        setNamePicture(acceptedFiles[0].name);
        if (!acceptedFiles[0].type.match('image/')) {
            setErrorPicture(true);
        } else {
            setErrorPicture(false);
            acceptedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const src: string = event.target.result as string;
                    setSrcPicture(src);
                }
                reader.readAsDataURL(file);
            })
        }
    }, []);
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});
    const onSubmit = async (user) => {
        if (errorPicture) {
            setError('picture', {
                type: "image",
                message: "Mettre une image"
            });
        } else {
            const formData = new FormData();
            formData.append('email', user.email);
            formData.append('firstName', user.firstName);
            formData.append('lastName', user.lastName);
            formData.append('job', user.job);
            formData.append('phone', user.phone);
            formData.append('description', user.description);
            formData.append('picture', user.picture[0]);

            const response = await api.post('users', formData, {headers: {
                'Content-Type': 'form-data'
            }});
        }
    }

    return (
        <div className={classes.body}>
            <Paper
                className={classes.content}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Typography>Créer un compte</Typography>
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
                        name="firstName"
                        label={<Typography>Prénom</Typography>}
                        inputRef={register({ required: true })}
                        error={errors.firstName}
                        helperText={errors.firstName ? <Typography>Le prénom est obligatoire</Typography> : null}
                    />
                    <TextField
                        className={classes.field}
                        name="lastName"
                        label={<Typography>Nom</Typography>}
                        inputRef={register({ required: true })}
                        error={errors.lastName}
                        helperText={errors.lastName ? <Typography>Le nom est obligatoire</Typography> : null}
                    />
                    <TextField
                        className={classes.field}
                        name="job"
                        label={<Typography>Poste professionnel</Typography>}
                        inputRef={register({ required: true })}
                        error={errors.job}
                        helperText={errors.job ? <Typography>Le poste est obligatoire</Typography> : null}
                    />
                    <TextField
                        className={classes.field}
                        name="phone"
                        type="tel"
                        label={<Typography>Téléphone</Typography>}
                        inputRef={register({ required: true, pattern:/^[0-9]{10}$/ })}
                        error={errors.phone}
                        helperText={errors.phone ? <Typography>Le téléphone est obligatoire, format 10 chiffres</Typography> : null}
                    />
                    <TextField
                        className={classes.field}
                        name="description"
                        multiline
                        label={<Typography>Présentez vous</Typography>}
                        inputRef={register({ required: true })}
                        error={errors.description}
                        rows={4}
                        variant="outlined"
                        helperText={errors.description ? <Typography>La description est obligatoire, pour vous présentez</Typography> : null}
                    />
                    <div
                        className={classes.drop}
                        {...getRootProps()}
                    >
                        <TextField 
                            name="picture"
                            type="file"
                            inputRef={register}
                            inputProps={{...getInputProps(), accept: 'image/png, image/jpg, image/jpeg, image/gif'}}
                            error={errors.picture}
                            label={namePicture ? <div className={classes.label}><Avatar src={srcPicture} alt="Photo de profil" /><Typography className={classes.white}>{namePicture}</Typography></div> : null}
                        />
                        {
                        isDragActive ?
                            <p>Drop votre photo de profil ici</p> :
                            <p>Drag 'n' drop votre photo de profil ici</p>
                        }
                    </div>
                    {errors.picture ? <FormHelperText className={classes.red}>Veuillez mettre une image</FormHelperText> : null}
                    <Button
                        className={classes.field}
                        type="submit"
                        variant="outlined"
                        color="primary"
                    >Créer</Button>
                </form>
            </Paper>
        </div>
    );
};

export default AddUser;