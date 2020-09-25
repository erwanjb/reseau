import React, { FC, useState, useEffect } from 'react';
import { Avatar, Tooltip, Typography, makeStyles, useMediaQuery } from '@material-ui/core';
import useApi from '../hooks/useApi';
import { useHistory, useParams } from 'react-router-dom';
import useAuth from "../hooks/useAuth";
import { useUserConnected } from "../hooks/useToken";
import NavBar from './NavBar';

const ProjectMessaging: FC = () => {
    const { projectId } = useParams() as any;
    const auth = useAuth();
    const currentUser = useUserConnected();

    const maxWidth500 = useMediaQuery('(max-width:500px)');
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
        }
    })

    const api = useApi();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [picture, setPicture] = useState('');
    const [categories, setCategories] = useState([]);
    const [users, setUsers] = useState([]);
    const [missions, setMissions] = useState([]);
    const [time, setTime] = useState(NaN);

    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const start = async () => {
            const project =  await api.get(`/projects/messaging/${projectId}`);
            setTitle(project.data.title);
            setDescription(project.data.description);
            setPicture(project.data.picture);
            setCategories(project.data.categories);
            setUsers(project.data.users);
            setMissions(project.data.missions);
            setTime(project.data.time);
        }
        start();
    }, []);

    useEffect(() => {
        const restart = async () => {
            const admin = await auth.isAAdmin(projectId);
            setIsAdmin(admin);
            const owner = await auth.isAOwner(projectId);
            setIsOwner(owner);
        }
        restart();
    }, [currentUser])

    const classes = useStyles();
    return (
        <div>
            <NavBar></NavBar>
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
        </div>
    );
}

export default ProjectMessaging;