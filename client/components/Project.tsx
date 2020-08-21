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
    Button
} from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import useApi from "../hooks/useApi";
import NavBar from './NavBar';

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

const members: Member[] = [
    {
        name: "John Doe",
        image: "http://www.pngmart.com/files/12/Boy-Emoji-Avatar-PNG.png",
        role: "planteur cultivateur"
    },
    {
        name: "Lisa Ford",
        image: "https://cdn0.iconfinder.com/data/icons/faces-of-girls/1000/_4-512.png",
        role: "planteur experte analyste"
    },
    {
        name: "Stephanie Foch",
        image: "https://b7.pngbarn.com/png/961/160/bitstrips-avatar-emoji-avatar-png-clip-art.png",
        role: "arboriste"
    }, 
    {
        name: "Tedd Jr White",
        image: "https://steemitimages.com/640x0/http://oi64.tinypic.com/taj9yb.jpg",
        role: "chef budget"
    }
];

/* const missions: Mission[] = [
    {
        title: "Production d'engrais de masse",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flexible_intermediate_bulk_containers-Fertilizer.jpg/800px-Flexible_intermediate_bulk_containers-Fertilizer.jpg",
        time: "2mois",
        assignedTo: []
    }, 
    {
        title: "Planter les pousses",
        image: "https://www.18h39.fr/wp-content/uploads/2018/12/planter-graines-arbres-getty-lovelyday12-1250x550.jpg",
        time: "2semaines",
        assignedTo: [
            {
                name: "John Doe",
                image: "http://www.pngmart.com/files/12/Boy-Emoji-Avatar-PNG.png",
                role: "planteur cultivateur"
            },
            {
                name: "Lisa Ford",
                image: "https://cdn0.iconfinder.com/data/icons/faces-of-girls/1000/_4-512.png",
                role: "planteur experte analyste"
            }
        ]
    },
    {
        title: "Production d'engrais de masse",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flexible_intermediate_bulk_containers-Fertilizer.jpg/800px-Flexible_intermediate_bulk_containers-Fertilizer.jpg",
        time: "2mois",
        assignedTo: []
    }, 
    {
        title: "Planter les pousses",
        image: "https://www.18h39.fr/wp-content/uploads/2018/12/planter-graines-arbres-getty-lovelyday12-1250x550.jpg",
        time: "2semaines",
        assignedTo: [
            {
                name: "John Doe",
                image: "http://www.pngmart.com/files/12/Boy-Emoji-Avatar-PNG.png",
                role: "planteur cultivateur"
            },
            {
                name: "Lisa Ford",
                image: "https://cdn0.iconfinder.com/data/icons/faces-of-girls/1000/_4-512.png",
                role: "planteur experte analyste"
            }
        ]
    },
    {
        title: "Production d'engrais de masse",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Flexible_intermediate_bulk_containers-Fertilizer.jpg/800px-Flexible_intermediate_bulk_containers-Fertilizer.jpg",
        time: "2mois",
        assignedTo: []
    }, 
    {
        title: "Planter les pousses",
        image: "https://www.18h39.fr/wp-content/uploads/2018/12/planter-graines-arbres-getty-lovelyday12-1250x550.jpg",
        time: "2semaines",
        assignedTo: [
            {
                name: "John Doe",
                image: "http://www.pngmart.com/files/12/Boy-Emoji-Avatar-PNG.png",
                role: "planteur cultivateur"
            },
            {
                name: "Lisa Ford",
                image: "https://cdn0.iconfinder.com/data/icons/faces-of-girls/1000/_4-512.png",
                role: "planteur experte analyste"
            }
        ]
    }
]; */

const Project: FC = () => {
    const maxWidth500 = useMediaQuery('(max-width:500px)');
    const maxWidth900 = useMediaQuery('(max-width:900px)');

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
        }
    });

    const api = useApi();
    const classes = useStyles();
    const history = useHistory();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [missions, setMissions] = useState([]);

    useEffect(() => {
        const start = async () => {
            const project =  await api.get(`projects/${id}`);
            setTitle(project.data.title);
            setDescription(project.data.description);
            setPicture(project.data.picture);
            setCategories(project.data.categories);
            setUsers(project.data.users);
            setMissions(project.data.missions);
        }
        start();
    }, []);

    const handleClick = (id) => {
        history.push('/profil/' + id);
    }

    const AddMission = () => {
        history.push('/addMission/' + id);
    }

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
                                <div>
                                    {categories.map((category, index) => {
                                        return (
                                            <Tooltip key={"" + index} title={category.name}>
                                                <Typography className={classes.colorBlue} variant="h4">{category.name}</Typography>
                                            </Tooltip>
                                        );
                                    })
                                    }
                                </div>
                            </div>
                        </div>
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
                            value={35}
                        />
                        <Typography variant="body2" color="textSecondary">35%</Typography>
                    </div>
                    <Button variant="outlined" color="primary" onClick={AddMission}>Ajouter une mission</Button>
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
        </div>
    );
};

export default Project;