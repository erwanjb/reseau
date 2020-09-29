import React, { FC, useCallback, useState, useEffect } from 'react';
import { Paper, Typography, MenuItem, Tooltip, Checkbox, ListItemText, Select, Input, TextField, Button, makeStyles, FormHelperText, Avatar, Popover, Accordion, AccordionDetails, AccordionSummary, Slider, Chip } from "@material-ui/core";
import {DesktopWindows, ExpandMore as ExpandMoreIcon} from '@material-ui/icons';
import { useForm } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import useApi from "../hooks/useApi";
import NavBar from "./NavBar";
import { useHistory, useParams } from 'react-router-dom';
import { setToken } from "../store/auth/actions"
import { useDispatch } from "react-redux";
import { Autocomplete } from '@material-ui/lab';
import useAuth from '../hooks/useAuth';

const UpdateMission: FC = () => {
    const auth = useAuth();
    const dispatch = useDispatch();
    const { missionId } = useParams() as any;
    const api = useApi();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [time, setTime] = useState('');
    const [projectId, setProjectId] = useState('')

    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [reload, setReload]= useState(false);

    const [assigned, setAssigned] = useState([]);
    const [oldAssigned, setOldAssigned] = useState([]);
    const [users, setUsers] = useState([]);
    console.log(isOwner)
    useEffect(() => {
        const start = async () => {
            if (isAdmin || isOwner) {
                const mission =  await api.get(`/projects/mission/admin/${missionId}`);
                setName(mission.data.name);
                setTime(mission.data.time);
                setDescription(mission.data.description);
                setPicture(mission.data.picture);
                setProjectId(mission.data.projectId);
                setUsers(mission.data.users);
                setOldAssigned(mission.data.members);
                setAssigned(mission.data.members.map(member => member.id));
            } else {
                const mission =  await api.get(`/projects/mission/${missionId}`);
                setName(mission.data.name);
                setTime(mission.data.time);
                setDescription(mission.data.description);
                setPicture(mission.data.picture);
                setProjectId(mission.data.projectId);
            }
        }
        start();
    }, [reload, isAdmin, isOwner]);

    useEffect(() => {
        const start = async () => {
            const owner = await auth.isAOwner(projectId);
            const admin = await auth.isAAdmin(projectId);
            setIsAdmin(admin);
            setIsOwner(owner);
        }
        start()
    }, [projectId])

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
            width: "100%"
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
        },
        marginTop50: {
            marginTop: 50
        },
        auto: {
            marginTop: 20,
        },
        media: {
            width: 90,
            height: 50
        },
        mediaUpload: {
            width: 68,
            height: 38
        },
        block: {
            display: 'block'
        },
        flex: {
            display: 'flex'
        }
    })

    const history = useHistory();
    const classes = useStyles();

    const { register, handleSubmit, errors, setError, clearErrors } = useForm();

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
        if (type === 'picture' && errorPicture) {
            setError('picture', {
                type: "image",
                message: "Mettre une image"
            });
        }  else {

            const formData = new FormData();
            if (type === 'picture') {
                formData.append('picture', toChange[type][0]);
            } else if (type === 'users') {
                formData.append('users', JSON.stringify(assigned));
            } else {
                formData.append(type, toChange[type]);
            }
            if (type !== 'users') {
                try {
                    await api.put('/projects/mission/' + missionId, formData, {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    });
                    setOpen(true);
                    setPopoverStatus(201);
                    window.location.reload();
                } catch (err) {
                    console.log(err)
                    setOpen(true);
                    setPopoverStatus(409)
                }
            } else {
                try {
                    await api.put('/projects/missionUser/' + missionId, formData, {
                        headers: {
                            'content-type': 'multipart/form-data'
                        }
                    });
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
    }

    const [open, setOpen] = useState(false);
    const [popoverStatus, setPopoverStatus] = useState(0);

    const handleClose = () => {
        setOpen(false);
    };


    const handleChangeMultiple = (event) => {
        const { value } = event.target;
        const newValue = [];
        for (let i = 0, l = value.length; i < l; i += 1) {
          if (value[i].selected) {
            newValue.push(value[i]);
          }
        }
        setAssigned(value);
    };
    
    const idPopover = open ? 'simple-popover' : undefined;

    const handleProject = () => {
        history.push('/project/' + projectId);
    }

    return (
        <div>
            <NavBar></NavBar>
            <div className={classes.body}>
                <Paper
                    className={classes.content}
                >   
                    <Button variant="outlined" color="primary" onClick={handleProject}>Retour au project</Button>
                    <Typography>Modifier la mission</Typography>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Nom de la mission</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'name'))}>
                                <Typography>Ancien Nom de la Mission : {name}</Typography>
                                <TextField
                                    className={classes.field}
                                    name="name"
                                    label={<Typography>Titre du projet</Typography>}
                                    inputRef={register()}
                                    error={errors.name}
                                    helperText={errors.name ? <Typography>Le Nom est obligatoire</Typography> : null}
                                />
                                <Button type="submit" variant="outlined" color="primary">Changer le Nom</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Temps de la mission</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        <form onSubmit={handleSubmit(onSubmit.bind(null, 'time'))}>
                                <Typography>Ancien temps de la Mission : {time}</Typography>
                                <TextField
                                    className={classes.field}
                                    name="time"
                                    label={<Typography>Temps de la mission</Typography>}
                                    inputRef={register()}
                                    error={errors.time}
                                    helperText={errors.time ? <Typography>Le temps est obligatoire</Typography> : null}
                                />
                                <Button type="submit" variant="outlined" color="primary">Changer le temps</Button>
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
                            <Typography>Photo du projet</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'picture'))}>
                                <Typography>Ancienne photo : {}</Typography>
                                <img className={classes.media} alt="photo mission" src={'/image/' + picture} />
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
                                        label={namePicture ? <div className={classes.label}><img className={classes.mediaUpload} src={srcPicture} alt="Photo de profil" /><Typography className={classes.white}>{namePicture}</Typography></div> : null}
                                    />
                                    {
                                    isDragActive ?
                                        <p>Drop votre photo du projet ici</p> :
                                        <p>Drag 'n' drop votre photo du projet ici</p>
                                    }
                                </div>
                                {errors.picture ? <FormHelperText className={classes.red}>Veuillez mettre une image</FormHelperText> : null}
                                <Button type="submit" variant="outlined" color="primary">Changer photo</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    {
                        isOwner || isAdmin ?
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                >
                                    <Typography>Membres de la mission</Typography>
                                </AccordionSummary>
                                <AccordionDetails
                                    className={classes.block}
                                >
                                    <Typography>anciens membres de la mission :</Typography>
                                    <div className={classes.flex}>
                                        {oldAssigned.map((user, index) => {
                                            return <Tooltip key={'' + index} title={user.firstName + ' ' + user.lastName}><Avatar alt={user.firstName + ' ' + user.lastName} src={'/image/' + user.picture} /></Tooltip>
                                        })}
                                    </div>
                                    <Typography>Choisir des membres pour la mission :</Typography>
                                    <form onSubmit={handleSubmit(onSubmit.bind(null, 'users'))}>
                                        <Select
                                            name="users"
                                            labelId="demo-mutiple-checkbox-label"
                                            id="demo-mutiple-checkbox"
                                            multiple
                                            className={classes.field}
                                            value={assigned}
                                            onChange={handleChangeMultiple}
                                            input={<Input />}
                                            renderValue={(selected: any) => selected.map(id => {
                                                const userFind = users.find(user => user.id === id);
                                                return userFind.firstName + ' ' + userFind.lastName;
                                            }).join(', ')}
                                        >
                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user.id}>
                                                <Checkbox checked={assigned.indexOf(user.id) > -1} />
                                                <ListItemText primary={user.firstName + ' ' + user.lastName} />
                                                <Avatar src={'/image/' + user.picture} alt={user.firstName + ' ' + user.lastName} />
                                            </MenuItem>
                                        ))}
                                        </Select>
                                        <Button type="submit" variant="outlined" color="primary">Changer membres</Button>
                                    </form>
                                </AccordionDetails>
                            </Accordion>
                        : null
                    }
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

export default UpdateMission;