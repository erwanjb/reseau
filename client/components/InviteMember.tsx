import React, { FC, useState } from 'react';
import NavBar from "./NavBar";
import {makeStyles, useMediaQuery, Typography, TextField, Button, Paper, Avatar, Tooltip, Popover} from "@material-ui/core";
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import useApi from "../hooks/useApi";

const InviteMember: FC = () => {

    const maxWidth600 = useMediaQuery('(max-width:600px)');
    const useStyles = makeStyles({
        title: {
            color: '#05647A',
            fontFamily: "acme",
            textAlign: 'center'
        },
        searchPeople: {
            marginBottom: 50,
            textAlign: 'center'
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
            marginBottom: 15,
            marginRight: 30,
            '&:hover': {
                backgroundColor: '#05647A',
            }
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
            width: 200,
            height: 360,
            minHeight: 100,
            padding: 20,
            marginRight: 50,
            marginBottom: 50
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
        popoverGreen: {
            backgroundColor: '#2CFA67',
            color: '#fff'
        },
        margin: {
            marginTop: 50,
            marginBottom: 50
        }
    });

    const [open, setOpen] = useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };
    
    const idPopover = open ? 'simple-popover' : undefined;

    const { projectId } = useParams() as any;

    const classes = useStyles();
    const history = useHistory();
    const { register, handleSubmit, errors, setError, clearErrors } = useForm();

    const [members, setMembers] = useState([]);
    const api = useApi();
    
    const onSubmit = async (payload) => {
        setMembers([]);
        const data = `search=${encodeURI(payload.search)}&job=${encodeURI(payload.job)}`;
        const result = await api.get(`/users/filter/search?${data}`);
        setMembers(result.data);
    }

    const handleProfil = (memberId) => {
        history.push('/profil/' + memberId);
    }   

    const onSubmitInvite = async (memberId, index, payload) => {
        if (!payload['role'+index]) {
            setError('role' +index, {
                type: "required",
                message: "Mettre un role"
            });
        } else {
            await api.post('/projects/invite/' + projectId + '/' + memberId, {
                role: payload['role'+index], messageInvitation: payload.messageInvitation
            });
            setOpen(true);
            
        }
    }
    
    const handleRetour = () => {
        history.push('/project/' + projectId);
    }

    return (
        <div>
            <NavBar></NavBar>
            <div className={classes.searchPeople}>
                <Button className={classes.margin} variant="outlined" color="primary" onClick={handleRetour}>Retour au projet</Button>
                <Typography className={classes.subTitle} variant="h2" >Inviter une personne</Typography>
                <div className={classes.marginTop}>
                    <form  onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                        <TextField name="job" className={classes.field} label="Rechercher par métier" inputRef={register()} />
                        <TextField name="search" className={classes.fieldName} label="Rechercher par Nom/Prénom" inputRef={register()} />
                        <Button className={classes.button} type="submit" variant="outlined" color="primary">Rechercher</Button>
                    </form>
                </div>
            </div>
            <div className={classes.result}>
                <Typography className={classes.subTitle} variant="h2" >Résultats</Typography>
                <div className={classes.contentResult}>
                    {
                        members.map((member, index) => {
                            return(
                                <Paper 
                                    key={''+ index}
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
                                    <div>
                                        <Button className={classes.btn} variant="outlined" color="primary" onClick={handleProfil.bind(null, member.id)}>Voir profil</Button>
                                        <form onSubmit={handleSubmit(onSubmitInvite.bind(null, member.id, index))}>
                                            <TextField
                                                className={classes.field}
                                                name={"role" + index}
                                                label={<Typography>Indiquez le role</Typography>}
                                                inputRef={register()}
                                                error={errors['role' + index] ? true : false}
                                                helperText={errors['role' + index] ? 'Le Role est obligatoire' : null}
                                            />
                                            <TextField
                                                className={classes.field}
                                                name="messageInvitation"
                                                multiline
                                                label={<Typography>Message d'invitation</Typography>}
                                                inputRef={register()}
                                                rows={4}
                                                variant="outlined"
                                            />
                                            <Button type="submit" className={classes.btn} variant="outlined" color="primary">Inviter</Button>
                                        </form>
                                    </div>
                                </Paper>
                            );
                        })
                    }
                </div>
            </div>
            <Popover
                id={idPopover}
                open={open}
                onClose={handleClose}
                
            > 
                <Typography className={classes.popoverGreen}>Une invitation a été envoyé</Typography>
            </Popover>
        </div>
    );

}

export default InviteMember;