import React, { FC, useState, useEffect } from 'react';
import { Avatar, Typography, Paper, makeStyles, useMediaQuery, Tooltip, Button } from '@material-ui/core';
import { useHistory, useParams } from 'react-router-dom';
import useApi from "../hooks/useApi";
import NavBar from "./NavBar";

interface Project {
    title: string;
    image: string;
    description: string;
}

const hello: Project[] = [
    {
        title: 'Pousse des arbres',
        image: "https://image.freepik.com/photos-gratuite/jeune-arbre-qui-pousse-dans-jardin-lever-du-soleil-jour-terre-concept-eco_34152-1510.jpg",
        description: "Verdir la planète un chantier d'avenir et de tous les jours"
    },
    {
        title: 'les transports du futurs',
        image: "https://img-0.journaldunet.com/Xo4dRvF6JTd6f3YE3xhF9mUne_w=/300x/smart/c3456eb235414967a5b1e92b36312f9f/ccmcms-jdn/1885065.jpg",
        description: "Les nouveaux moteurs de demain sont en action pour vous amenez plus vite, plus loin, dans de bonnes conditions"
    },
    {
        title: 'Un monde plus heureux',
        image: "https://ds1.static.rtbf.be/article/image/370x208/e/2/0/ad5beebdee26ac02350753e322362c7a-1553107429.jpg",
        description: "Se battre avec soi même pour atteindre la plénitude peut être un chemin compliqué, mais une fois parcouru l'extase et d'autant plus grande"
    },
    {
        title: 'Pousse des arbres',
        image: "https://image.freepik.com/photos-gratuite/jeune-arbre-qui-pousse-dans-jardin-lever-du-soleil-jour-terre-concept-eco_34152-1510.jpg",
        description: "Verdir la planète un chantier d'avenir et de tous les jours"
    },
    {
        title: 'les transports du futurs',
        image: "https://img-0.journaldunet.com/Xo4dRvF6JTd6f3YE3xhF9mUne_w=/300x/smart/c3456eb235414967a5b1e92b36312f9f/ccmcms-jdn/1885065.jpg",
        description: "Les nouveaux moteurs de demain sont en action pour vous amenez plus vite, plus loin, dans de bonnes conditions"
    },
    {
        title: 'Un monde plus heureux',
        image: "https://ds1.static.rtbf.be/article/image/370x208/e/2/0/ad5beebdee26ac02350753e322362c7a-1553107429.jpg",
        description: "Se battre avec soi même pour atteindre la plénitude peut être un chemin compliqué, mais une fois parcouru l'extase et d'autant plus grande"
    }
]

const Profil: FC = () => {
    const { id } = useParams();
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
    const history = useHistory();
    const maxWidth900 = useMediaQuery('(max-width:900px)');
    const maxWidth500 = useMediaQuery('(max-width:500px)');

    const useStyles = makeStyles({
        container: {
            marginTop: 50,
            marginLeft: 50,
            display: maxWidth900 ? 'block' : 'flex'
        },
        containerProfil: {
            height: maxWidth900 ? '' : '100vh',
            marginBottom: 50,
            width: maxWidth900 ? '100%' : '35%'
        },
        fixed:{
            position: maxWidth900 ? 'static' : 'fixed',
            width: maxWidth900 ? '100%' : '35%'
        },
        avatar: {
            width: 150,
            height: 150
        },
        profil: {
            display: maxWidth500 ? 'block' : 'flex',
            marginBottom: 50
        },
        description: {
            marginLeft: maxWidth500 ? 0 : 50
        },
        notLongText: {
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3
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
        acme: {
            fontFamily: "acme"
        },
        desc: {
            marginBottom: 30,
            textAlign: 'justify'
        },
        project: {
            width: 240,
            height: 100,
            minHeight: 100,
            padding: 20,
            '&:hover': {
                backgroundColor: '#5F8883'
            }
        },
        headerProject: {
            display: "flex",
            alignItems: "center"
        },
        contentProject: {
            display: 'flex',
            flexWrap: "wrap",
        },
        mainProject: {
            marginLeft: maxWidth900 ? 0 : 100,
            width: maxWidth900 ? '100%' : 'calc(65% - 100px)'
        },
        titleProject: {
            fontFamily: 'acme',
            color: '#05647A',
            marginBottom: 50
        },
        projectTitle: {
            fontFamily: 'acme',
            color: '#05647A',
            marginLeft: 10,
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1
        },
        btn: {
            cursor: 'pointer',
            marginBottom: 30,
            marginRight: 30
        }
    });

    const classes = useStyles();

    const handleClick = (id) => {
        history.push('/project/' + id);
    }
    
    const handleCreate = () => {
        history.push('/addProject');
    }

    return (
        <div>
            <NavBar></NavBar>
            <div className={classes.container}>
                <div className={classes.containerProfil}>
                    <div className={classes.fixed}>
                        <div className={classes.profil}>
                            <Avatar
                                className={classes.avatar}
                                alt={firstName + ' ' + lastName}
                                src={"/image/" + picture}
                            ></Avatar>
                            <div className={classes.description}>
                                <Tooltip title={firstName + ' ' + lastName}>
                                    <Typography className={classes.colorBlue} variant="h2">{firstName + ' ' + lastName}</Typography>
                                </Tooltip>
                                <Tooltip title={job}>
                                    <Typography className={classes.colorBlue} variant="h4">{job}</Typography>
                                </Tooltip>
                            </div>
                        </div>
                        <div>
                            <Typography className={classes.desc}>
                                {description}
                            </Typography>
                            <Typography className={classes.acme}>téléphone: {phone}</Typography>
                            <Typography className={classes.acme}>email: {email}</Typography>
                        </div>
                    </div>
                </div>
                <div className={classes.mainProject}>
                    <Typography variant="h5" className={classes.titleProject}>Mes projets</Typography>
                    <Button
                        variant="outlined"
                        onClick={handleCreate}
                    >Créer un projet</Button>
                    <div className={classes.contentProject}>
                        {projects.map((project, index) => {
                            return (
                                <a 
                                    className={classes.btn}
                                    onClick={handleClick.bind(null, project.id)} 
                                    key={'' + index}
                                >
                                    <Paper 
                                        className={classes.project}
                                        elevation={3}                
                                    >
                                        <div className={classes.headerProject}>
                                            <Avatar
                                                src={"/image/" + project.picture}
                                                alt={project.title}
                                            ></Avatar>
                                            <Tooltip title={project.title}>
                                                <Typography className={classes.projectTitle}>{project.title}</Typography>
                                            </Tooltip>
                                        </div>
                                        <Tooltip title={project.description}>
                                            <Typography className={classes.notLongText}>{project.description}</Typography>
                                        </Tooltip>
                                    </Paper>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profil;