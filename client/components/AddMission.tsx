import React, { FC, useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useApi from '../hooks/useApi';
import NavBar from './NavBar';
import { Paper, FormHelperText, makeStyles, Typography, TextField, InputLabel, Select, MenuItem, Input, Checkbox, ListItemText, Avatar, Button } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

const AddMission: FC = () => {
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
    })
    const history = useHistory();
    const classes = useStyles();
    const { projectId } = useParams() as any;
    const api = useApi();
    const [users, setUsers] = useState([]);
    const [assigned, setAssigned] = React.useState([]);
    const { register, handleSubmit, errors, setError, clearErrors } = useForm();

    useEffect(() => {
        const start = async () => {
            const project =  await api.get(`projects/${projectId}`);
            setUsers(project.data.users);
        }
        start();
    }, []);

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

    const onSubmit = async (mission) => {
        if (errorPicture) {
            setError('picture', {
                type: "image",
                message: "Mettre une image"
            });
        } else {
            const formData = new FormData();
            formData.append('name', mission.name);
            formData.append('description', mission.description);
            formData.append('time', mission.time);
            formData.append('users', JSON.stringify(assigned));

            formData.append('picture', mission.picture[0]);
            await api.post('/projects/addMission/' + projectId, formData, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            });
            history.push('/project/' + projectId);
        }
    }

    const [namePicture, setNamePicture] = useState('');
    const [errorPicture, setErrorPicture] = useState(false);
    const [srcPicture, setSrcPicture] = useState('');

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
                        <Typography>Créer une mission</Typography>
                        <TextField
                            className={classes.field}
                            name="name"
                            label={<Typography>Nom de la mission</Typography>}
                            inputRef={register({ required: true })}
                            error={errors.name}
                            helperText={errors.name ? <Typography>Le Nom est obligatoire</Typography> : null}
                        />
                        <TextField
                            className={classes.field}
                            name="time"
                            label={<Typography>Indiquez le temps estimé</Typography>}
                            inputRef={register({ required: true })}
                            error={errors.time}
                            helperText={errors.time ? <Typography>Le Temps est obligatoire</Typography> : null}
                        />
                        <InputLabel className={classes.field} id="demo-mutiple-checkbox-label">Assignés à la mission</InputLabel>
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
                        <TextField
                            className={classes.field}
                            name="description"
                            multiline
                            label={<Typography>Présentez la mission</Typography>}
                            inputRef={register({ required: true })}
                            error={errors.description}
                            rows={4}
                            variant="outlined"
                            helperText={errors.description ? <Typography>La description est obligatoire</Typography> : null}
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
        </div>
    );
};

export default AddMission;