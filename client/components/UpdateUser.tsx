import React, { FC, useCallback, useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, makeStyles, FormHelperText, Avatar, Popover, Accordion, AccordionDetails, AccordionSummary } from "@material-ui/core";
import {DesktopWindows, ExpandMore as ExpandMoreIcon} from '@material-ui/icons';
import { useForm } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import useApi from "../hooks/useApi";
import NavBar from "./NavBar";
import { useHistory, useParams } from 'react-router-dom';
import { setToken } from "../store/auth/actions"
import { useDispatch } from "react-redux";

interface FileReaderEventTarget extends EventTarget {
    result: Buffer
}
interface Json {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    job: string;
    phone: string;
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage():string;
}

const UpdateUser: FC = () => {
    const dispatch = useDispatch();
    const { id } = useParams() as any;
    const api = useApi();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [job, setJob] = useState('');
    const [projects, setPojects] = useState([]);

    useEffect(() => {
        const start = async () => {
            const user =  await api.get(`users/${id}`);
            setFirstName(user.data.firstName);
            setLastName(user.data.lastName);
            setEmail(user.data.email);
            setPhone(user.data.phone);
            setDescription(user.data.description);
            setPicture(user.data.picture);
            setJob(user.data.job);
            setPojects(user.data.projects);
        }
        start();
    }, []);

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
        },
        popoverGreen: {
            backgroundColor: '#2CFA67',
            color: '#fff'
        },
        popoverRed: {
            backgroundColor: '#f44336',
            color: '#fff'
        }
    })

    const history = useHistory();
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
    const onSubmit = async (type, toChange) => {
        if (errorPicture) {
            setError('picture', {
                type: "image",
                message: "Mettre une image"
            });
        }  else {

            const formData = new FormData();
            if (type !== 'picture') {
                formData.append(type, toChange[type]);
            } else {
                formData.append('picture', toChange[type][0]);
            }
            try {
                const response = await api.put('users/' + id, formData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
                const token = response.data.token;
                dispatch(setToken(token));
                setOpen(true);
                setPopoverStatus(201);
                window.location.reload();
            } catch (err) {
                console.log(err)
                setOpen(true);
                setPopoverStatus(409)
            }
        }
    }

    const onConnect = () => {
       
    }

    const [open, setOpen] = useState(false);
    const [popoverStatus, setPopoverStatus] = useState(0);
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const idPopover = open ? 'simple-popover' : undefined;

    return (
        <div>
            <NavBar></NavBar>
            <div className={classes.body}>
                <Paper
                    className={classes.content}
                >
                    <Typography>Modifier son profil</Typography>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Prénom</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'firstName'))}>
                                <Typography>Ancien prénom : {firstName}</Typography>
                                <TextField
                                    className={classes.field}
                                    name="firstName"
                                    label={<Typography>Prénom</Typography>}
                                    inputRef={register()}
                                    error={errors.firstName}
                                    helperText={errors.firstName ? <Typography>Le prénom est obligatoire</Typography> : null}
                                />
                                <Button type="submit" variant="outlined" color="primary">Changer prénom</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Nom</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'lastName'))}>
                                <Typography>Ancien nom : {lastName}</Typography>
                                <TextField
                                    className={classes.field}
                                    name="lastName"
                                    label={<Typography>Nom</Typography>}
                                    inputRef={register()}
                                    error={errors.lastName}
                                    helperText={errors.lastName ? <Typography>Le nom est obligatoire</Typography> : null}
                                />
                                <Button type="submit" variant="outlined" color="primary">Changer nom</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Poste professionel</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'job'))}>
                                <Typography>Ancien post : {job}</Typography>
                                <TextField
                                    className={classes.field}
                                    name="job"
                                    label={<Typography>Poste professionnel</Typography>}
                                    inputRef={register()}
                                    error={errors.job}
                                    helperText={errors.job ? <Typography>Le poste est obligatoire</Typography> : null}
                                />
                                <Button type="submit" variant="outlined" color="primary">Changer poste</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Téléphone</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'phone'))}>
                                <Typography>Ancien téléphone : {phone}</Typography>
                                <TextField
                                    className={classes.field}
                                    name="phone"
                                    type="tel"
                                    label={<Typography>Téléphone</Typography>}
                                    inputRef={register({ pattern:/^[0-9]{10}$/ })}
                                    error={errors.phone}
                                    helperText={errors.phone ? <Typography>Le téléphone est obligatoire, format 10 chiffres</Typography> : null}
                                />
                                <Button type="submit" variant="outlined" color="primary">Changer téléphone</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Email</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'email'))}>
                                <Typography>Ancien email (change aussi votre identifiant) : {email}</Typography>
                                <TextField
                                    className={classes.field}
                                    name="email"
                                    label={<Typography>Email</Typography>}
                                    inputRef={register({ pattern:/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/ })}
                                    error={errors.email}
                                    helperText={errors.email ? <Typography>Le mail est obligatoire en format mail -@-.-</Typography> : null}
                                />
                                <Button type="submit" variant="outlined" color="primary">Changer email</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Description</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'description'))}>
                                <Typography>Ancienne description : {description}</Typography>
                                <TextField
                                    className={classes.field}
                                    name="description"
                                    multiline
                                    label={<Typography>Présentez vous</Typography>}
                                    inputRef={register()}
                                    error={errors.description}
                                    rows={4}
                                    variant="outlined"
                                    helperText={errors.description ? <Typography>La description est obligatoire, pour vous présentez</Typography> : null}
                                />
                                <Button type="submit" variant="outlined" color="primary">Changer description</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Photo de profil</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'picture'))}>
                                <Typography>Ancienne photo : {}</Typography>
                                <Avatar alt="photo profil" src={'/image/' + picture}></Avatar>
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
                                <Button type="submit" variant="outlined" color="primary">Changer photo</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                </Paper>
                <Popover
                    id={idPopover}
                    open={open}
                    onClose={handleClose}
                    
                >
                    {popoverStatus === 201 ? 
                    <Typography className={classes.popoverGreen}>Votre profil a été modifié, allez sur la page de connexion pour vous connecter</Typography> : 
                    (popoverStatus === 409 ?
                    <Typography className={classes.popoverRed}>Une erreur c'est produite</Typography> :
                    null)    
                }   
                </Popover>
            </div>
        </div>
    );
};

export default UpdateUser;