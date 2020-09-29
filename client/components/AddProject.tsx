import React, { FC, useCallback, useState, useEffect } from 'react';
import NavBar from './NavBar';
import { Paper, makeStyles, Button, TextField, Typography, FormHelperText, Avatar, Chip, Popover, Slider, FormLabel } from "@material-ui/core";
import { Autocomplete } from '@material-ui/lab';
import { useForm } from "react-hook-form";
import { useDropzone } from 'react-dropzone';
import { useUserConnected } from "../hooks/useToken";
import useApi from "../hooks/useApi";
import { useHistory } from 'react-router-dom';

const addProject: FC = () => {
    const history = useHistory();
    const user = useUserConnected();
    const api = useApi();
    const useStyles = makeStyles({
        content: {
            height: 'calc(100vh - 64px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        field: {
            display: 'block',
            marginTop: 20,
            "& div": {
                width: "100%"
            }
        },
        auto: {
            marginTop: 20,
        },
        paper: {
            width: 280,
            padding: 10
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
        marginTop: {
            marginTop: 20,
            display: 'block'
        },
        marginTop50: {
            marginTop: 50
        }
    });
    const [namePicture, setNamePicture] = useState('');
    const [errorPicture, setErrorPicture] = useState(false);
    const [srcPicture, setSrcPicture] = useState('');
    const [time, setTime] = useState(0);
 
    const [open, setOpen] = useState(false);
    const [popoverStatus, setPopoverStatus] = useState(0);
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const id = open ? 'simple-popover' : undefined;

    const { register, handleSubmit, errors, setError, clearErrors } = useForm();

    const classes = useStyles();

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
    const onSubmit = async (project) => {
        if (errorPicture) {
            setError('picture', {
                type: "image",
                message: "Mettre une image"
            });
        } else if (!categories.length) {
            setError('categories', {
                type: "catégorie",
                message: "Mettre au moins une catégorie"
            })
        } else {
            const formData = new FormData();
            formData.append('title', project.title);
            formData.append('description', project.description);
            formData.append('role', project.role);
            formData.append('categories', JSON.stringify(categories));
            formData.append('time', time.toString());
            
            formData.append('picture', project.picture[0]);
            try {
                await api.post('/projects/' + user.id, formData, {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
                setOpen(true);
                setPopoverStatus(201);
                history.push('/profil/' + user.id);
            } catch (err) {
                console.log(err)
                setOpen(true);
                setPopoverStatus(409)
            }
        }
    }

    const [categories, setCategories] = useState([] as string[]);
    const addCategory = (event) => {
        const cat = [...categories];
        if (event.target.value && !categories.find(categ => categ === event.target.value)){
            setCategories([...cat, event.target.value]);
            clearErrors('categories');
        }
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

    const onDelete = (event) => {
        const newCat = [...categories]
        let index;
        if (event.target.parentNode.tagName === 'DIV') {
            index = categories.indexOf(event.target.parentNode.querySelector('span').innerHTML);
        } else {
            index = categories.indexOf(event.target.parentNode.parentNode.querySelector('span').innerHTML);
        }
        newCat.splice(index, 1);
        setCategories(newCat);
    }

    const onChange = (event, value) => {
        setTime(value);
    }

    return (
        <div>
            <NavBar></NavBar>
            <div
                className={classes.content}
            >
                <Paper
                    className={classes.paper}
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Typography>Créer un projet</Typography>
                        <TextField
                            className={classes.field}
                            name="title"
                            label={<Typography>Titre</Typography>}
                            inputRef={register({ required: true })}
                            error={errors.title}
                            helperText={errors.title ? <Typography>Le titre est obligatoire</Typography> : null}
                        />
                        <TextField
                            className={classes.field}
                            name="description"
                            multiline
                            label={<Typography>Présentez le projet</Typography>}
                            inputRef={register({ required: true })}
                            error={errors.description}
                            rows={4}
                            variant="outlined"
                            helperText={errors.description ? <Typography>La description est obligatoire</Typography> : null}
                        />
                        <TextField
                            className={classes.field}
                            name="role"
                            label={<Typography>Votre rôle dans le projet</Typography>}
                            inputRef={register({ required: true })}
                            error={errors.role}
                            helperText={errors.role ? <Typography>Le rôle est obligatoire</Typography> : null}
                        />
                        <FormLabel className={classes.marginTop}>Estimation du temps déjà réalisé (en %)</FormLabel>
                        <Slider className={classes.marginTop50} defaultValue={time} valueLabelDisplay="on" onChange={onChange} />
                        <Autocomplete
                            className={classes.auto}
                            multiple
                            id="tags-standard"
                            noOptionsText="Pas de catégorie"
                            options={categories}
                            getOptionLabel={(option) => option}
                            value={categories}
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
                                label={namePicture ? <div className={classes.label}><Avatar src={srcPicture} alt="Photo du projet" /><Typography className={classes.white}>{namePicture}</Typography></div> : null}
                            />
                            {
                            isDragActive ?
                                <p>Drop la photo du projet ici</p> :
                                <p>Drag 'n' drop la photo du projet ici</p>
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
            <Popover
                id={id}
                open={open}
                onClose={handleClose}
                
            >
                {popoverStatus === 201 ? 
                <Typography className={classes.popoverGreen}>Le project a été créé, aller sur votr profil pour y accéder</Typography> : 
                (popoverStatus === 409 ?
                <Typography className={classes.popoverRed}>Une erreur est parvenue, pas de project créé</Typography> :
                null)    
            }   
            </Popover>
        </div>
    );
};

export default addProject;