import React, { FC } from 'react';
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
    Tooltip
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';

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

const missions: Mission[] = [
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
];

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
        }
    });

    const classes = useStyles();
    const history = useHistory();

    const handleClick = () => {
        history.push('/profil');
    }

    return (
        <div>
            <div className={classes.container}>
                <div className={classes.contentProject}>
                    <div className={classes.fixed}>
                        <div className={classes.project}>
                            <Avatar
                                className={classes.avatar}
                                src="https://image.freepik.com/photos-gratuite/jeune-arbre-qui-pousse-dans-jardin-lever-du-soleil-jour-terre-concept-eco_34152-1510.jpg"                     
                                alt="Pousse des arbres"
                            >
                            </Avatar>
                            <div className={classes.description}>
                                <Tooltip title="Pousse des arbres">
                                    <Typography className={classes.colorBlue} variant="h2">Pousse des arbres</Typography>
                                </Tooltip>
                                <Tooltip title="Ecologie">
                                    <Typography className={classes.colorBlue} variant="h4">Ecologie</Typography>
                                </Tooltip>
                            </div>
                        </div>
                        <div>
                            <Typography className={classes.desc}>
                                Verdir la planète un chantier d'avenir et de tous les jours Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
                            </Typography>
                        </div>
                        <Typography className={classes.titleMembre} variant="h4">Membres</Typography>
                        <div className={classes.contentMember}>
                            {
                                members.map((member, index) => {
                                    return(
                                        <a
                                            className={classes.btn}
                                            onClick={handleClick}
                                        >
                                            <Paper 
                                                    className={classes.member}
                                                    elevation={3}                
                                                >
                                                <div className={classes.headerMember}>
                                                    <Avatar
                                                        src={member.image}
                                                        alt={member.name}
                                                    ></Avatar>
                                                    <Tooltip title={member.name}>
                                                        <Typography className={classes.memberTitle}>{member.name}</Typography>
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
                    <div>
                        <Typography className={classes.titleMission} variant="h4">Missions à effectuer</Typography>
                        <div className={classes.contentMission}>
                            {missions.map((mission, index) => {
                                return (
                                    <Card className={classes.root} variant="outlined">
                                        <CardHeader
                                            subheader={
                                                <Tooltip title={mission.title}>
                                                    <Typography className={classes.titleCard}>{mission.title}</Typography>
                                                </Tooltip>
                                            }
                                        />
                                        <CardMedia
                                            className={classes.media}
                                            image={mission.image}
                                            title={mission.title}                      
                                        />
                                        <CardContent>
                                            <Typography>Temps estimé: {mission.time}</Typography>
                                            <div className={classes.contentMemberMission}>
                                                {mission.assignedTo.map((member, index) => {
                                                    return (
                                                        <Avatar
                                                            src={member.image}
                                                            alt={member.name}
                                                        >
                                                        </Avatar>
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