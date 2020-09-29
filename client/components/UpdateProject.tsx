import React, { FC, useCallback, useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, makeStyles, FormHelperText, Avatar, Popover, Accordion, AccordionDetails, AccordionSummary, Slider, Chip } from "@material-ui/core";
import {DesktopWindows, ExpandMore as ExpandMoreIcon} from '@material-ui/icons';
import { useForm } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import useApi from "../hooks/useApi";
import NavBar from "./NavBar";
import { useHistory, useParams } from 'react-router-dom';
import { setToken } from "../store/auth/actions"
import { useDispatch } from "react-redux";
import { Autocomplete } from '@material-ui/lab';

const UpdateProject: FC = () => {
    const dispatch = useDispatch();
    const { projectId } = useParams() as any;
    const api = useApi();

    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState([]);
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [time, setTime] = useState(0);

    useEffect(() => {
        const start = async () => {
            const project =  await api.get(`/projects/${projectId}`);
            setTitle(project.data.title);
            setCategories(project.data.categories.map(cat => cat.name));
            setTime(project.data.time);
            setDescription(project.data.description);
            setPicture(project.data.picture);
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
        },
        marginTop50: {
            marginTop: 50
        },
        auto: {
            marginTop: 20,
        },
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
        } else if (type === 'categories' && !newCategories.length) {
            setError('categories', {
                type: "catégorie",
                message: "Mettre au moins une catégorie"
            })
        }  else {

            const formData = new FormData();
            if (type === 'picture') {
                formData.append('picture', toChange[type][0]);
            } else if (type === 'categories') {
                formData.append('categories', JSON.stringify(newCategories));
            } else if (type === 'time') {
                formData.append('time', newTime.toString());
            } else {
                formData.append(type, toChange[type]);
            }
            try {
                await api.put('/projects/' + projectId, formData, {
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

    const onConnect = () => {
       
    }

    const [open, setOpen] = useState(false);
    const [popoverStatus, setPopoverStatus] = useState(0);
    
    const [newTime, setNewTime] = useState(0);
    const [newCategories, setNewCategories] = useState([]);

    const handleClose = () => {
        setOpen(false);
    };

    const onChange = (event, value) => {
        setNewTime(value);
    }

    const addCategory = (event) => {
        const cat = [...newCategories];
        if (event.target.value && !newCategories.find(categ => categ === event.target.value)){
            setNewCategories([...cat, event.target.value]);
            clearErrors('categories');
        }
    }

    const onDelete = (event) => {
        const newCat = [...newCategories];
        let index;
        if (event.target.parentNode.tagName === 'DIV') {
            index = categories.indexOf(event.target.parentNode.querySelector('span').innerHTML);
        } else {
            index = categories.indexOf(event.target.parentNode.parentNode.querySelector('span').innerHTML);
        }
        newCat.splice(index, 1);
        setNewCategories(newCat);
    }

    const onKeyUp = (event: React.FocusEvent<HTMLInputElement>) => {
        addCategory(event);
    }

    useEffect(() => {
        window.addEventListener('keypress', (event: any) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                event.target.blur();
            }
        })
        window.addEventListener('submit', (event: any) => {
            event.preventDefault();
            if (categories.length) {
                event.target.submit = (event) =>  { event.preventDefault(); }
                event.target.submit();
            }
            return false;
        })
    }, [categories])
    
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
                    <Typography>Modifier le projet</Typography>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Titre du projet</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'title'))}>
                                <Typography>Ancien titre : {title}</Typography>
                                <TextField
                                    className={classes.field}
                                    name="title"
                                    label={<Typography>Titre du projet</Typography>}
                                    inputRef={register()}
                                    error={errors.title}
                                    helperText={errors.title ? <Typography>Le titre est obligatoire</Typography> : null}
                                />
                                <Button type="submit" variant="outlined" color="primary">Changer titre</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Avancée du projet</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'time'))}>
                                <Typography>Ancienne avancée (en %) : {time} %</Typography>
                                <Slider className={classes.marginTop50} defaultValue={newTime} valueLabelDisplay="on" onChange={onChange} />
                                <Button type="submit" variant="outlined" color="primary">Changer l'avancée</Button>
                            </form>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography>Catégories</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <form onSubmit={handleSubmit(onSubmit.bind(null, 'categories'))}>
                                <Typography>Anciennes catégories: {categories.join(', ')}</Typography>
                                <Autocomplete
                                    className={classes.auto}
                                    multiple
                                    id="tags-standard"
                                    noOptionsText="Pas de catégorie"
                                    options={newCategories}
                                    getOptionLabel={(option) => option}
                                    value={newCategories}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            variant="standard"
                                            label="Catégories du projet"
                                            placeholder="Catégories"
                                            onBlur={onKeyUp}
                                        />
                                        )}
                                    renderTags={(value, getTagProps) => <>{value.map((val, ind) =><Chip key={''+ind} label={val} onDelete={onDelete} />)}</>}
                                />
                                {errors.categories ? <FormHelperText className={classes.red}>Ajouter au moins une catégorie</FormHelperText> : null}
                                <Button type="submit" variant="outlined" color="primary">Changer catégories</Button>
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
                                        <p>Drop votre photo du projet ici</p> :
                                        <p>Drag 'n' drop votre photo du projet ici</p>
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

export default UpdateProject;