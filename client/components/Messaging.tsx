import React, { FC, useState, useEffect } from 'react';
import { Avatar, Tooltip, Typography, makeStyles, useMediaQuery, Paper, Button, Modal , TextField} from '@material-ui/core';
import useApi from '../hooks/useApi';
import { useHistory, useParams } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import { useUserConnected } from "../hooks/useToken";
import NavBar from './NavBar';
import { useForm } from "react-hook-form";

const Messaging: FC = () => {

    const history = useHistory();
    const auth = useAuth();
    const currentUser = useUserConnected();
    const userId = currentUser ? currentUser.id : null;

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

    const api = useApi();

    const [projectNotTreated, setProjectNotTreated] = useState([]);
    const [projectRefused, setProjectRefused] = useState([]);
    const [reload, setReload] = useState(false);
    
    const [projectInvitedWaiting, setProjectInvitedWaiting] = useState([]);
    const [projectInvitedRefused, setProjectInvitedRefused] = useState([]);

    useEffect(() => {
        const start = async () => {
            const project =  await api.get(`/users/messaging/me`);
            setProjectNotTreated(project.data.projectNotTreated);
            setProjectRefused(project.data.projectRefused);
            setProjectInvitedWaiting(project.data.projectInvitedWaiting);
            setProjectInvitedRefused(project.data.projectInvitedRefused);
        }
        start();
    }, [reload]);

    const handleInvite = async (id) => {
        await api.post('/users/demande/' + id);
        setReload(!reload);
    }

    const handleRetour = () => {
        history.push('/profil/' + userId);
    }

    const handleRefused = async (id) => {
        await api.post('/users/refuse/' + id);
        setReload(!reload);
    }

    const handleReInvite = async (id) => {
        await api.post('/users/redemande/' + id);
        setReload(!reload);
    }

    const handleAnnule = async (id) => {
        await api.post('/users/cancel/'  + id);
        setReload(!reload);
    }
 
    const classes = useStyles();
    return (
        <div>
            <NavBar></NavBar>
            <Typography className={classes.colorBlue} variant="h2">Messagerie</Typography>
            <Button className={classes.btnRetour} variant="outlined" color="primary" onClick={handleRetour}>Retour au profil</Button>
            <div className={classes.messaging}>
                <div className={classes.width}>
                    <Typography className={classes.subTitle}>Invitations pour rejoindre un projet</Typography>
                    <div className={classes.contentResult}>
                        {
                            projectNotTreated.map((project, index) => {
                                return (
                                <Paper 
                                    className={classes.member}
                                    elevation={3}
                                    key= {''+index}                
                                >
                                    <div className={classes.headerMember}>
                                        <Avatar
                                            src={'/image/' + project.picture}
                                            alt={project.title}
                                        ></Avatar>
                                        <Tooltip title={project.title}>
                                            <Typography className={classes.memberTitle}>{project.title}</Typography>
                                        </Tooltip>
                                    </div>
                                    <Tooltip title={project.categories.map((cat, index) => {
                                        return cat.name
                                    }).join(' ')}>
                                        <Typography className={classes.job}>{project.categories.map((cat, index) => {
                                            return cat.name
                                        }).join(' ')}</Typography>
                                    </Tooltip>
                                    <Tooltip title={project.description}>
                                        <Typography className={classes.description}>{project.description}</Typography>
                                    </Tooltip>
                                    <Tooltip title={project.messageDemande}>
                                        <Typography className={classes.message}>{project.messageInvitation}</Typography>
                                    </Tooltip>
                                    <Button variant="outlined" color="primary" onClick={handleInvite.bind(null, project.id)}>Accepter</Button>
                                    <Button variant="outlined" color="secondary" onClick={handleRefused.bind(null, project.id)}>Refuser</Button>
                                </Paper>)
                            })
                        }
                    </div>
                </div>
                <div className={classes.width}>
                   <Typography className={classes.subTitle}>Projets refusés</Typography>
                   <div className={classes.contentResult}>
                        {
                            projectRefused.map((project, index) => {
                                return(
                                    <Paper 
                                    className={classes.memberRefused}
                                    elevation={3}
                                    key= {''+index}                
                                >
                                    <div className={classes.headerMember}>
                                        <Avatar
                                            src={'/image/' + project.picture}
                                            alt={project.title}
                                        ></Avatar>
                                        <Tooltip title={project.title}>
                                            <Typography className={classes.memberTitle}>{project.title}</Typography>
                                        </Tooltip>
                                    </div>
                                    <Tooltip title={project.categories.map((cat, index) => {
                                        return cat.name
                                    }).join(' ')}>
                                        <Typography className={classes.job}>{project.categories.map((cat, index) => {
                                            return cat.name
                                        }).join(' ')}</Typography>
                                    </Tooltip>
                                    <Tooltip title={project.description}>
                                        <Typography className={classes.description}>{project.description}</Typography>
                                    </Tooltip>
                                    <Button variant="outlined" color="primary" onClick={handleReInvite.bind(null, project.id)}>Ré-Accepter</Button>
                                </Paper>
                                )
                            })
                        }
                   </div>
                </div>
            </div>
            <div className={classes.messaging}>
                <div className={classes.width}>
                    <Typography className={classes.subTitle}>Demandes en attente</Typography>
                    <div className={classes.contentResult}>
                        {
                            projectInvitedWaiting.map((project, index) => {
                                return (
                                <Paper 
                                    className={classes.member}
                                    elevation={3}
                                    key= {''+index}                
                                >
                                    <div className={classes.headerMember}>
                                        <Avatar
                                            src={'/image/' + project.picture}
                                            alt={project.title}
                                        ></Avatar>
                                        <Tooltip title={project.title}>
                                            <Typography className={classes.memberTitle}>{project.title}</Typography>
                                        </Tooltip>
                                    </div>
                                    <Tooltip title={project.categories.map((cat, index) => {
                                        return cat.name
                                    }).join(' ')}>
                                        <Typography className={classes.job}>{project.categories.map((cat, index) => {
                                            return cat.name
                                        }).join(' ')}</Typography>
                                    </Tooltip>
                                    <Tooltip title={project.description}>
                                        <Typography className={classes.description}>{project.description}</Typography>
                                    </Tooltip>
                                    <Tooltip title={project.messageDemande}>
                                        <Typography className={classes.message}>{project.messageDemande}</Typography>
                                    </Tooltip>
                                    <Button variant="outlined" color="primary" onClick={handleAnnule.bind(null, project.id)}>Annuler la demande</Button>
                                </Paper>)
                            })
                        }
                    </div>
                </div>
                <div className={classes.width}>
                   <Typography className={classes.subTitle}>Utilisateurs ayant refusés l'invitation</Typography>
                   <div className={classes.contentResult}>
                        {
                            projectInvitedRefused.map((project, index) => {
                                return(
                                    <Paper 
                                    className={classes.userInvitedRefused}
                                    elevation={3}
                                    key= {''+index}                
                                >
                                    <div className={classes.headerMember}>
                                        <Avatar
                                            src={'/image/' + project.picture}
                                            alt={project.title}
                                        ></Avatar>
                                        <Tooltip title={project.title}>
                                            <Typography className={classes.memberTitle}>{project.title}</Typography>
                                        </Tooltip>
                                    </div>
                                    <Tooltip title={project.categories.map((cat, index) => {
                                        return cat.name
                                    }).join(' ')}>
                                        <Typography className={classes.job}>{project.categories.map((cat, index) => {
                                            return cat.name
                                        }).join(' ')}</Typography>
                                    </Tooltip>
                                    <Tooltip title={project.description}>
                                        <Typography className={classes.description}>{project.description}</Typography>
                                    </Tooltip>
                                </Paper>
                                )
                            })
                        }
                   </div>
                </div>
            </div>
        </div>
    );
}

export default Messaging;