import React, { FC, useState } from 'react';
import NavBar from "./NavBar";
import {makeStyles, useMediaQuery, Typography, TextField, Button, Paper, Avatar, Tooltip} from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import useApi from "../hooks/useApi";

const Home: FC = () => {

    const maxWidth1300 = useMediaQuery('(max-width:1300px)');
    const maxWidth600 = useMediaQuery('(max-width:600px)');
    const useStyles = makeStyles({
        searchContent: {
            display: maxWidth1300 ? 'block' : 'flex',
        },
        title: {
            color: '#05647A',
            fontFamily: "acme",
            textAlign: 'center'
        },
        searchProject: {
            width: maxWidth1300 ? '100%' : '50%',
            marginBottom: 50
        },
        searchPeople: {
            width: maxWidth1300 ? '100%' : '50%',
            marginBottom: 50
        },
        subTitle: {
            color: '#05647A',
            fontFamily: "acme",
            textAlign: 'center',
            fontSize: 25
        },
        button: {
            display: maxWidth600 ? 'block' : 'inline-flex',
            marginTop: 20
        },
        field: {
            marginRight: 10,
            marginTop: 20
        },
        fieldName: {
            marginRight: 10,
            width: 250,
            marginTop: 20
        },
        marginTop: {
            marginTop: 30
        },
        form: {
            display: 'flex',
            flexDirection: maxWidth600 ? 'column' : 'row', 
            justifyContent: "center",
            alignItems: 'center'
        },
        result: {
            marginTop: 50
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
        notLongText: {
            overflow: "hidden",
            width: '100%',
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3
        },
        contentResult: {
            display: 'flex',
            flexWrap: "wrap",
            padding: '0px 20px'
        },
        projetCat: {
            display: 'flex'
        },
        cat: {
            marginRight: 10
        }
    });

    const history = useHistory();

    const handleClick = (type, id) => {
        history.push(`/${type}/${id}`);
    }

    const [members, setMembers] = useState([]);
    const [projects, setProjects] = useState([]);

    const { register, handleSubmit } = useForm();
    
    const api = useApi();

    const onSubmit = async (type, payload) => {
        setProjects([]);
        setMembers([]);
        let data = '';
        if (type === 'projects') {
            data = `title=${encodeURI(payload.title)}&category=${encodeURI(payload.category)}`;
            const result = await api.get(`/${type}/filter/search?${data}`);
            setProjects(result.data);
        } else if (type === 'users') {
            data = `search=${encodeURI(payload.search)}&job=${encodeURI(payload.job)}`;
            const result = await api.get(`/${type}/filter/search?${data}`);
            setMembers(result.data);
        }
    }
    const classes = useStyles();
    return (
        <div>
            <NavBar></NavBar>
            <Typography className={classes.title} variant="h1">
                Réseau 
            </Typography>
            <div className={classes.searchContent}>
                <div className={classes.searchProject}>
                    <Typography className={classes.subTitle} variant="h2">Rechercher un projet</Typography>
                    <div className={classes.marginTop}>
                        <form onSubmit={handleSubmit(onSubmit.bind(null, 'projects'))} className={classes.form}>
                            <TextField name="category" className={classes.field} label="Rechercher par catégorie" inputRef={register()} />
                            <TextField name="title" className={classes.field} label="Rechercher par Nom" inputRef={register()} />
                            <Button className={classes.button} type="submit" variant="outlined" color="primary">Rechercher</Button>
                        </form>
                    </div>
                </div>
                <div className={classes.searchPeople}>
                    <Typography className={classes.subTitle} variant="h2" >Rechercher une personne</Typography>
                    <div className={classes.marginTop}>
                        <form  onSubmit={handleSubmit(onSubmit.bind(null, 'users'))} className={classes.form}>
                            <TextField name="job" className={classes.field} label="Rechercher par métier" inputRef={register()} />
                            <TextField name="search" className={classes.fieldName} label="Rechercher par Nom/Prénom" inputRef={register()} />
                            <Button className={classes.button} type="submit" variant="outlined" color="primary">Rechercher</Button>
                        </form>
                    </div>
                </div>
            </div>
            <div className={classes.result}>
                <Typography className={classes.subTitle} variant="h2" >Résultats</Typography>
                <div className={classes.contentResult}>
                    {
                        members.map((member, index) => {
                            return(
                                <a
                                    className={classes.btn}
                                    onClick={handleClick.bind(null, 'profil', member.id)}
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
                                        <Typography>{member.job}</Typography>
                                    </Paper>
                                </a>
                            );
                        })
                    }
                    {projects.map((project, index) => {
                            return (
                                <a 
                                    className={classes.btn}
                                    onClick={handleClick.bind(null, 'project', project.id)} 
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
                                        <div className={classes.projetCat}>
                                            {project.categories.split(',').map((category, index) => {
                                                return (
                                                    <div className={classes.cat} key={""+ index}>
                                                        <Tooltip title={category}>
                                                            <Typography>{category}</Typography>
                                                        </Tooltip>
                                                    </div>);
                                            })}
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
    );
};

export default Home;