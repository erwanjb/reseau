import React, { FC, useEffect, useState } from 'react';
import { 
    Avatar, 
    Typography, 
    makeStyles, 
    useMediaQuery, 
    LinearProgress,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    Paper,
    Tooltip,
    Button,
    Modal,
    TextField,
    IconButton
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import useApi from "../hooks/useApi";
import NavBar from './NavBar';
import useAuth from "../hooks/useAuth";
import { useUserConnected } from "../hooks/useToken";
import { useForm } from "react-hook-form";
import { MoreVert as MoreVertIcon } from '@material-ui/icons';

interface Member {
    name: string;
    role: string;
    image: string;
}

interface Mission {
    title: string;
    image:string;
    time: string;
    assignedTo? : Member[];
}

const Project: FC = () => {
    const maxWidth500 = useMediaQuery('(max-width:500px)');
    const maxWidth900 = useMediaQuery('(max-width:900px)');
    const auth = useAuth();
    const currentUser = useUserConnected();

    const useStyles = makeStyles({
        container: {
            display: maxWidth900 ? 'block' : 'flex',
            marginLeft: 50,
            marginTop: 50,
        },
        contentProject: {
            marginBottom: 50,
            width: maxWidth900 ? 'calc(100% - 30px)' : 'calc(50% - 30px)',
            paddingRight: 30
        },
        project: {
            display: maxWidth500 ? 'block' : 'flex',
            marginBottom: 30
        },
        description: {
            marginLeft: maxWidth500 ? 0 : 50 
        },
        colorBlue: {
            color: '#05647A',
            fontFamily: "acme",
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1
        },
        avatar: {
            width: 150,
            height: 150
        },
        desc: {
            marginBottom: 30,
            textAlign: 'justify'
        },
        contentProgressBar: {
            height: 50,
            width: 280,
            display: 'flex',
            alignItems: 'center'
        },
        progressBar: {
            width: '100%',
        },
        titleProgress: {
            color: '#05647A',
            fontFamily: "acme",
        },
        titleMembre: {
            color: '#05647A',
            fontFamily: "acme",
            marginBottom: 30
        },
        secondContent: {
            marginLeft: maxWidth900 ? 0 : 100,
            width: maxWidth900 ? '100%' : 'calc(50% - 100px)'
        },
        media: {
            height: 150,
            backgroundSize: "280px 150px"
        },
        root: {
            width: 280,
            marginRight: 30,
            marginBottom: 30
        },
        titleMission: {
            color: '#05647A',
            fontFamily: "acme",
            marginBottom: 30
        },
        contentMission: {
            display: "flex",
            flexWrap: "wrap",
        },
        contentMemberMission: {
            display: 'flex'
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
            height: 100,
            minHeight: 100,
            padding: 20,
            '&:hover': {
                backgroundColor: '#5F8883'
            }
        },
        btn: {
            cursor: 'pointer',
            marginBottom: 30,
            marginRight: 30
        },
        fixed: {
            position: maxWidth900 ? 'static' : 'fixed',
            width: maxWidth900 ? 'calc(100% - 30px)' : 'calc(50% - 30px)',
            overflowY: maxWidth900? 'visible' : 'scroll',
            height: maxWidth900 ? 'auto' : '100vh',
            paddingRight: 30
        },
        titleCard: {
            color: '#05647A',
            fontFamily: "acme",
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1
        },
        missionDesc : {
            marginBottom: 10,
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3
        },
        cat: {
            display: 'flex',
            flexWrap: 'wrap'
        },
        subCat: {
            marginRight: 50
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
        message: {
            marginLeft: 30,
            marginTop: 30,
            marginRight: 30,
        },
        btnModal: {
            marginTop: 30,
            marginLeft: 30,
        }
    });

    const api = useApi();
    const classes = useStyles();
    const history = useHistory();
    const { id } = useParams() as any;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [missions, setMissions] = useState([]);
    const [time, setTime] = useState(NaN);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isNotUserTreated, setIsNotUserTreated] = useState(false);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const start = async () => {
            const project =  await api.get(`/projects/${id}`);
            setTitle(project.data.title);
            setDescription(project.data.description);
            setPicture(project.data.picture);
            setCategories(project.data.categories);
            setUsers(project.data.users);
            setMissions(project.data.missions);
            setTime(project.data.time);
        }
        start();
    }, [reload]);

    const [isAssigned, setIsAssigned] = useState({} as any);
    console.log(isAssigned)
    useEffect(() => {
        const start = async () => {
            const accumulator = {};
            setIsAssigned({});
            missions.map(async miss => {
                const newId = await auth.isAssigned(miss.id)
                accumulator[miss.id] = newId;
                setIsAssigned({...accumulator, [miss.id]: newId})
            })
        }
        start();
    }, [missions, currentUser]);

    useEffect(() => {
        const restart = async () => {
            const admin = await auth.isAAdmin(id);
            setIsAdmin(admin);
            const owner = await auth.isAOwner(id);
            setIsOwner(owner);
            const notUserTreated = await auth.isNotAUserTreated(id);
            setIsNotUserTreated(notUserTreated); 
        }
        restart();
    }, [currentUser, reload])

    const handleClick = (id) => {
        history.push('/profil/' + id);
    }

    const AddMission = () => {
        history.push('/addMission/' + id);
    }

    const handleInvite = () => {
        history.push('/inviteMember/' + id);
    }

    const handleMessaging = () => {
        history.push('/projectMessaging/' + id);
    }

    const onsubmit = async ({messageDemande}) => {
        await api.post('/users/demande/' + id, {
            messageDemande
        });
        setReload(!reload);
        setOpen(false);
    }

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleUpdate = () => {
        history.push('/updateProject/' + id);
    }

    const handleUpdateMission = (id) => {
        history.push('/updateMission/' + id);
    }

    const handleManage = () => {
        history.push('/manageMember/' + id);
    }

    const { register, handleSubmit, errors, setError, clearErrors } = useForm();

    return (
        <div>
            <NavBar></NavBar>
            <div className={classes.container}>
                <div className={classes.contentProject}>
                    <div className={classes.fixed}>
                        <div className={classes.project}>
                            <Avatar
                                className={classes.avatar}
                                src={"/image/" + picture}           
                                alt={title}
                            >
                            </Avatar>
                            <div className={classes.description}>
                                <Tooltip title={title}>
                                    <Typography className={classes.colorBlue} variant="h2">{title}</Typography>
                                </Tooltip>
                                <div className={classes.cat}>
                                    {categories.map((category, index) => {
                                        return (
                                            <div className={classes.subCat}>
                                            <Tooltip key={"" + index} title={category.name}>
                                                <Typography className={classes.colorBlue} variant="h4">{category.name}</Typography>
                                            </Tooltip>
                                            </div>
                                        );
                                    })
                                    }
                                </div>
                            </div>
                        </div>
                        {isAdmin || isOwner ?
                            <>
                                <Button variant="outlined" color="primary" onClick={handleInvite}>Inviter des membres</Button> 
                                <Button variant="outlined" color="primary" onClick={handleMessaging}>Messagerie du projet</Button>
                                <Button variant="outlined" color="primary" onClick={handleManage}>Gérer les membres</Button>
                            </>
                        : null
                        }
                        {
                            isOwner ?
                                    <Button variant="outlined" color="primary" onClick={handleUpdate}>Modifier le projet</Button>
                            : null
                        }
                        {isNotUserTreated ?
                            <Button variant="outlined" color="primary" onClick={handleOpen}>Demander à rejoindre le projet</Button>
                        : null    
                        }
                        <div>
                            <Typography className={classes.desc}>
                               {description}
                            </Typography>
                        </div>
                        <Typography className={classes.titleMembre} variant="h4">Membres</Typography>
                        <div className={classes.contentMember}>
                            {
                                users.map((member, index) => {
                                    return(
                                        <a
                                            className={classes.btn}
                                            onClick={handleClick.bind(null, member.id)}
                                        >
                                            <Paper 
                                                    className={classes.member}
                                                    elevation={3}                
                                                >
                                                <div className={classes.headerMember}>
                                                    <Avatar
                                                        src={'/image/' + member.picture}
                                                        alt={member.firstName +  ' ' + member.lastName}
                                                    ></Avatar>
                                                    <Tooltip title={member.firstName +  ' ' + member.lastName}>
                                                        <Typography className={classes.memberTitle}>{member.firstName +  ' ' + member.lastName}</Typography>
                                                    </Tooltip>
                                                </div>
                                                <Typography>{member.role}</Typography>
                                            </Paper>
                                        </a>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={classes.secondContent}>
                    <Typography className={classes.titleProgress} variant="h4">Avancement du projet</Typography>
                    <div className={classes.contentProgressBar}>
                        <LinearProgress
                            className={classes.progressBar}
                            variant="determinate"
                            value={time}
                        />
                        <Typography variant="body2" color="textSecondary">{time}%</Typography>
                    </div>
                    {isAdmin || isOwner ? <Button variant="outlined" color="primary" onClick={AddMission}>Ajouter une mission</Button> : null}
                    <div>
                        <Typography className={classes.titleMission} variant="h4">Missions à effectuer</Typography>
                        <div className={classes.contentMission}>
                            {missions.map((mission, index) => {
                                return (
                                    <Card className={classes.root} variant="outlined">
                                        <CardHeader
                                            subheader={
                                                <Tooltip title={mission.name}>
                                                    <Typography className={classes.titleCard}>{mission.name}</Typography>
                                                </Tooltip>
                                            }
                                            action={ isOwner || isAdmin || isAssigned[mission.id] ?
                                                <IconButton aria-label="settings"
                                                    onClick={handleUpdateMission.bind(null, mission.id)}
                                                >
                                                  <MoreVertIcon />
                                                </IconButton>
                                                : null
                                            }
                                        />
                                        <CardMedia
                                            className={classes.media}
                                            image={ mission.picture ? "/image/" + mission.picture : "/image/business-3189797_1920.png"}
                                            title={mission.name}                      
                                        />
                                        <CardContent>
                                            <Tooltip  title={mission.description}>
                                                <Typography className={classes.missionDesc}>{mission.description}</Typography>
                                            </Tooltip>
                                            <Typography>Temps estimé: {mission.time}</Typography>
                                            <div className={classes.contentMemberMission}>
                                                {mission.users.map((member, index) => {
                                                    return (
                                                        <Tooltip key={""+index} title={member.firstName + ' ' + member.lastName}>
                                                            <Avatar
                                                                src={ "/image/" + member.picture}
                                                                alt={member.firstName + ' ' + member.lastName}
                                                            >
                                                            </Avatar>
                                                        </Tooltip>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className={classes.modal}>
                    <Typography className={classes.titleModal}>Envoyer une demande pour rejoindre le projet</Typography>
                    <form onSubmit={handleSubmit(onsubmit)}>
                        <TextField
                            className={classes.message}
                            name="messageDemande"
                            multiline
                            label={<Typography>Message de demande</Typography>}
                            inputRef={register()}
                            rows={4}
                            variant="outlined"
                        />
                        <Button type="submit" className={classes.btnModal} variant="outlined" color="primary">Envoyer</Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default Project;