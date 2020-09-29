import React, { FC, useState, useEffect } from 'react';
import { Avatar, Tooltip, Typography, makeStyles, useMediaQuery, Paper, Button, Modal , TextField} from '@material-ui/core';
import useApi from '../hooks/useApi';
import { useHistory, useParams } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import { useUserConnected } from "../hooks/useToken";
import NavBar from './NavBar';
import { useForm } from "react-hook-form";

const ProjectMessaging: FC = () => {

    const history = useHistory();
    const { projectId } = useParams() as any;
    const auth = useAuth();
    const currentUser = useUserConnected();

    const maxWidth500 = useMediaQuery('(max-width:500px)');
    const maxWidth900 = useMediaQuery('(max-width:900px)');

    const useStyles = makeStyles({
        project: {
            display: maxWidth500 ? 'block' : 'flex',
            alignItems: 'center',
            marginTop: 50,
            marginBottom: 30,
            marginLeft: 50
        },
        colorBlue: {
            color: '#05647A',
            fontFamily: "acme",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            marginLeft: maxWidth500 ? 0 : 30,
        },
        avatar: {
            width: 150,
            height: 150
        },
        messaging: {
            display: maxWidth900 ? 'block' : 'flex',
            marginLeft: 50,
            marginRight: 50,
            marginTop: 50
        },
        memberTitle: {
            fontFamily: 'acme',
            color: '#05647A',
            marginLeft: 10,
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1
        },
        headerMember: {
            display: "flex",
            alignItems: "center"
        },
        contentMember: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        member: {
            width: 150,
            height: 300,
            minHeight: 100,
            padding: 20
        },
        memberRefused: {
            width: 150,
            height: 200,
            minHeight: 100,
            padding: 20
        },
        job: {
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            marginBottom: 10
        },
        description: {
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            marginBottom: 10
        },
        message: {
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
        },
        modal: {
            backgroundColor: '#fff',
            width: 300,
            height: 300,
            position: "absolute",
            top: 'calc(50vh - 150px)',
            left: 'calc(50% - 150px)',
        },
        titleModal: {
            marginLeft: 30,
            marginTop: 30,
            marginRight: 30,
            color: '#05647A'
        },
        role: {
            marginLeft: 30,
            marginTop: 30,
            marginRight: 30,
        },
        btnModal: {
            marginTop: 30,
            marginLeft: 30,
        },
        btnRetour: {
            marginTop: 50,
            marginLeft: 50
        },
        contentResult: {
            display: 'flex',
            flexWrap: "wrap",
            padding: '0px 20px',
        },
        width: {
            width: maxWidth900 ? '100%' : '50%',
            '&:nth-child(1)': {
                borderRight: maxWidth900 ? null :   '2px solid #05647A'
            }
        },
        subTitle: {
            marginLeft: 50,
            marginBottom: 20,
            marginTop: 20,
            color: '#05647A',
        },
        userInvitedRefused: {
            width: 150,
            height: 130,
            minHeight: 100,
            padding: 20
        }
    })

    const { register, handleSubmit, errors, setError, clearErrors } = useForm();

    const api = useApi();

    const [title, setTitle] = useState('');
    const [picture, setPicture] = useState('');
    const [userNotTreated, setUserNotTreated] = useState([]);
    const [userRefused, setUserRefused] = useState([]);
    const [reload, setReload] = useState(false);
    
    const [userInvitedWaiting, setUserInvitedWaiting] = useState([]);
    const [userInvitedRefused, setUserInvitedRefused] = useState([]);

    useEffect(() => {
        const start = async () => {
            const project =  await api.get(`/projects/messaging/${projectId}`);
            setTitle(project.data.project.title);
            setPicture(project.data.project.picture);
            setUserNotTreated(project.data.userNotTreated);
            setUserRefused(project.data.userRefused);
            setUserInvitedWaiting(project.data.userInvitedWaiting);
            setUserInvitedRefused(project.data.userInvitedRefused);
        }
        start();
    }, [reload]);

    const [userId, setUserId] = useState('');
    const [userIdReInvite, setUserIdReInvite] = useState('');

    const onSubmit = async ({role, roleInvite}) => {

        if (role) {
        await api.post('/projects/invite/' + projectId + '/' + userId, {
            role: role
        });
        setOpen(false);
        setReload(!reload);
        } else {
            setError('role', {
                type: "required",
                message: "Mettre un role"
            })
        }
    }

    const handleInvite = (id) => {
        setOpen(true);
        setUserId(id);
    }

    const [open, setOpen] = useState(false);
    const [openReinvite, setOpenReinvite] = useState(false);

    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseReinvite = () => {
        setOpenReinvite(false);
    }

    const handleRetour = () => {
        history.push('/project/' + projectId);
    }

    const handleRefused = async (id) => {
        await api.post('/projects/refuse/' + projectId + '/' + id);
        setReload(!reload);
    }

    const handleReInvite = (id) => {
        setOpenReinvite(true);
        setUserIdReInvite(id);
    }

    const onSubmitReInvite = async ({role, roleInvite}) => {
        if (roleInvite) {
            await api.post('/projects/reinvite/' + projectId + '/' + userIdReInvite, {
                role: roleInvite
            });
            setReload(!reload);
            setOpenReinvite(false);
        } else {
            setError('roleInvite', {
                type: "required",
                message: "Mettre un role"
            })
        }
    }

    const handleAnnule = async (id) => {
        await api.post('/projects/cancel/' + projectId + '/' + id);
        setReload(!reload);
    }
 
    const classes = useStyles();
    return (
        <div>
            <NavBar></NavBar>
            <Button className={classes.btnRetour} variant="outlined" color="primary" onClick={handleRetour}>Retour au project</Button>
            <div className={classes.project}>
                <Avatar
                    className={classes.avatar}
                    src={"/image/" + picture}           
                    alt={title}
                >
                </Avatar>
                <Tooltip title={title + ' (Messagerie)'}>
                    <Typography className={classes.colorBlue} variant="h2">{title} (Messagerie)</Typography>
                </Tooltip>
            </div>
            <div className={classes.messaging}>
                <div className={classes.width}>
                    <Typography className={classes.subTitle}>Demandes pour rejoindre le projet</Typography>
                    <div className={classes.contentResult}>
                        {
                            userNotTreated.map((user, index) => {
                                return (
                                <Paper 
                                    className={classes.member}
                                    elevation={3}
                                    key= {''+index}                
                                >
                                    <div className={classes.headerMember}>
                                        <Avatar
                                            src={'/image/' + user.picture}
                                            alt={user.firstName +  ' ' + user.lastName}
                                        ></Avatar>
                                        <Tooltip title={user.firstName +  ' ' + user.lastName}>
                                            <Typography className={classes.memberTitle}>{user.firstName +  ' ' + user.lastName}</Typography>
                                        </Tooltip>
                                    </div>
                                    <Tooltip title={user.job}>
                                        <Typography className={classes.job}>{user.job}</Typography>
                                    </Tooltip>
                                    <Tooltip title={user.description}>
                                        <Typography className={classes.description}>{user.description}</Typography>
                                    </Tooltip>
                                    <Tooltip title={user.messageDemande}>
                                        <Typography className={classes.message}>{user.messageDemande}</Typography>
                                    </Tooltip>
                                    <Button variant="outlined" color="primary" onClick={handleInvite.bind(null, user.id)}>Inviter</Button>
                                    <Button variant="outlined" color="secondary" onClick={handleRefused.bind(null, user.id)}>Refuser</Button>
                                </Paper>)
                            })
                        }
                    </div>
                </div>
                <div className={classes.width}>
                   <Typography className={classes.subTitle}>Utilisateurs refusés</Typography>
                   <div className={classes.contentResult}>
                        {
                            userRefused.map((user, index) => {
                                return(
                                    <Paper 
                                    className={classes.memberRefused}
                                    elevation={3}
                                    key= {''+index}                
                                >
                                    <div className={classes.headerMember}>
                                        <Avatar
                                            src={'/image/' + user.picture}
                                            alt={user.firstName +  ' ' + user.lastName}
                                        ></Avatar>
                                        <Tooltip title={user.firstName +  ' ' + user.lastName}>
                                            <Typography className={classes.memberTitle}>{user.firstName +  ' ' + user.lastName}</Typography>
                                        </Tooltip>
                                    </div>
                                    <Tooltip title={user.job}>
                                        <Typography className={classes.job}>{user.job}</Typography>
                                    </Tooltip>
                                    <Tooltip title={user.description}>
                                        <Typography className={classes.description}>{user.description}</Typography>
                                    </Tooltip>
                                    <Button variant="outlined" color="primary" onClick={handleReInvite.bind(null, user.id)}>Ré-Inviter</Button>
                                </Paper>
                                )
                            })
                        }
                   </div>
                </div>
            </div>
            <div className={classes.messaging}>
                <div className={classes.width}>
                    <Typography className={classes.subTitle}>Invitation en attente</Typography>
                    <div className={classes.contentResult}>
                        {
                            userInvitedWaiting.map((user, index) => {
                                return (
                                <Paper 
                                    className={classes.member}
                                    elevation={3}
                                    key= {''+index}                
                                >
                                    <div className={classes.headerMember}>
                                        <Avatar
                                            src={'/image/' + user.picture}
                                            alt={user.firstName +  ' ' + user.lastName}
                                        ></Avatar>
                                        <Tooltip title={user.firstName +  ' ' + user.lastName}>
                                            <Typography className={classes.memberTitle}>{user.firstName +  ' ' + user.lastName}</Typography>
                                        </Tooltip>
                                    </div>
                                    <Tooltip title={user.job}>
                                        <Typography className={classes.job}>{user.job}</Typography>
                                    </Tooltip>
                                    <Tooltip title={user.description}>
                                        <Typography className={classes.description}>{user.description}</Typography>
                                    </Tooltip>
                                    <Tooltip title={user.messageInvitation}>
                                        <Typography className={classes.message}>{user.messageInvitation}</Typography>
                                    </Tooltip>
                                    <Button variant="outlined" color="primary" onClick={handleAnnule.bind(null, user.id)}>Annuler l'invitation</Button>
                                </Paper>)
                            })
                        }
                    </div>
                </div>
                <div className={classes.width}>
                   <Typography className={classes.subTitle}>Utilisateurs ayant refusés l'invitation</Typography>
                   <div className={classes.contentResult}>
                        {
                            userInvitedRefused.map((user, index) => {
                                return(
                                    <Paper 
                                    className={classes.userInvitedRefused}
                                    elevation={3}
                                    key= {''+index}                
                                >
                                    <div className={classes.headerMember}>
                                        <Avatar
                                            src={'/image/' + user.picture}
                                            alt={user.firstName +  ' ' + user.lastName}
                                        ></Avatar>
                                        <Tooltip title={user.firstName +  ' ' + user.lastName}>
                                            <Typography className={classes.memberTitle}>{user.firstName +  ' ' + user.lastName}</Typography>
                                        </Tooltip>
                                    </div>
                                    <Tooltip title={user.job}>
                                        <Typography className={classes.job}>{user.job}</Typography>
                                    </Tooltip>
                                    <Tooltip title={user.description}>
                                        <Typography className={classes.description}>{user.description}</Typography>
                                    </Tooltip>
                                </Paper>
                                )
                            })
                        }
                   </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className={classes.modal}>
                    <Typography className={classes.titleModal}>Accepter la demande de rejoindre le projet</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <TextField
                            className={classes.role}
                            name="role"
                            label={<Typography>Role du membre</Typography>}
                            inputRef={register({required: true})}
                            error={errors.role}
                            helperText="Le role est obligatoire"
                        />
                        <Button type="submit" className={classes.btnModal} variant="outlined" color="primary">Accepter</Button>
                        <Button variant="outlined" color="secondary" onClick={handleClose}>Annuler</Button>
                    </form>
                </div>
            </Modal>
            <Modal
                open={openReinvite}
                onClose={handleCloseReinvite}
            >
                <div className={classes.modal}>
                    <Typography className={classes.titleModal}>Ré-Inviter l'utilisateur a rejoindre le projet</Typography>
                    <form onSubmit={handleSubmit(onSubmitReInvite)}>
                        <TextField
                            className={classes.role}
                            name="roleInvite"
                            label={<Typography>Role du membre</Typography>}
                            inputRef={register({required: true})}
                            error={errors.roleInvite}
                            helperText="Le role est obligatoire"
                        />
                        <Button type="submit" className={classes.btnModal} variant="outlined" color="primary">Ré-Inviter</Button>
                        <Button variant="outlined" color="secondary" onClick={handleCloseReinvite}>Annuler</Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default ProjectMessaging;