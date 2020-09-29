import React, {useState, useEffect, FC} from 'react';
import { Paper, Avatar, Tooltip, Typography, makeStyles, Button, Menu, MenuItem, IconButton, TextField, Modal} from "@material-ui/core";
import { useHistory, useParams } from 'react-router-dom';
import useApi from "../hooks/useApi";
import NavBar from './NavBar';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';
import { useForm } from "react-hook-form";
import useAuth from "../hooks/useAuth";
import { AdminRoleEnum } from "../../server/projects/enums/adminRoleEnum";
import {useUserConnected} from '../hooks/useToken';

const ManageMember: FC = () => {

    const auth = useAuth();
    const { projectId } = useParams() as any;
    const api = useApi();
    const history = useHistory();

    const currentUser = useUserConnected();

    const [users, setUsers] = useState([]);
    const [reload, setReload] = useState(false);

    const { register, handleSubmit, errors, setError, clearErrors } = useForm();

    const [anchorEl, setAnchorEl] = useState({} as any);

    const [open, setOpen] = useState({} as any);
    const [isOwner, setIsOwner] = useState(false);
    
    useEffect(() => {
        const start = async () => {
            const project =  await api.get(`/projects/${projectId}`);
            setUsers(project.data.users);
            const owner = await auth.isAOwner(projectId);
            setIsOwner(owner);
        }
        start();
    }, [reload]);

    useEffect(() => {
        const accumulator = {}
        users.map(user => {
            const id = user.id;
            accumulator[id] = null;
            setAnchorEl({...accumulator, [id]:  null });
        })
    }, [users])

    useEffect(() => {
        setOpen({})
        const accumulator = {}
        users.map(user => {
            const id = user.id;
            accumulator[id] = anchorEl ? Boolean(anchorEl[id]) : false;
            setOpen({...accumulator, [id]: anchorEl ? Boolean(anchorEl[id]) : false });
        })
    }, [users, anchorEl])

    const useStyles = makeStyles({
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
            padding: '0px 50px',
            display: 'flex',
            flexWrap: 'wrap'
        },
        member: {
            width: 150,
            height: 100,
            minHeight: 100,
            padding: 20,
            marginRight: 30
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
            marginBottom:30
        },
        margin: {
            marginLeft: 30,
            marginRight: 30,
        },
        btnProject: {
            marginBottom: 50,
            marginTop: 50,
            textAlign: 'center'
        },
        center: {
            textAlign: 'center'
        }
    })

    const classes = useStyles();

    const handleRetour = () => {
        history.push('/project/' + projectId);
    }

    const handleClose = (id) => {
        setAnchorEl({...anchorEl, [id]: null});
    }
    const handleMenu = (id, event) => {
        setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
    }

    const [idMember, setIdMember] = useState('');
    const [oldRole, setOldRole] = useState('');

    const handleRole = (id, role) => {
        setIdMember(id);
        setOldRole(role);
        setAnchorEl({...anchorEl, [id]: null});
        setOpenRole(true);
    }

    const [openRole, setOpenRole] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);

    const handleCloseDelete = () => {
        setOpenDelete(false)
    }

    const handleCloseRole = () => {
        setOpenRole(false);
    }

    const onSubmitRole = async ({role}) => {
        await api.post('/projects/changeRole/' + projectId, {
            role,
            userId: idMember
        })
        setReload(!reload);
        setOpenRole(false);
    }

    const handleDelete = (id) => {
        setIdMember(id);
        setAnchorEl({...anchorEl, [id]: null});
        setOpenDelete(true);
    }

    const handleBtnDelete = async () => {
        await api.post('/projects/remove/' + projectId + '/' + idMember);
        setOpenDelete(false);
        setReload(!reload);
    }

    const handleBtnOwnerDelete = async () => {
        await api.post('/projects/removeFromOwner/' + projectId + '/' + idMember);
        setOpenDelete(false);
        setReload(!reload);
    }

    const handleProm = async (id) => {
        await api.post('/projects/promouvoir/' + projectId + '/' + id)
        setAnchorEl({...anchorEl, [id]: null});
        setReload(!reload);
    }

    const handleRetr = async (id) => {
        await api.post('/projects/retrograder/' + projectId + '/' + id)
        setAnchorEl({...anchorEl, [id]: null});
        setReload(!reload);
    }

    return (
        <div>
            <NavBar></NavBar>
            <div className={classes.center}>
                <Button className={classes.btnProject} variant="outlined" color="primary" onClick={handleRetour}>Retour au projet</Button>
            </div>
            <div className={classes.contentMember}>
                {users.map((member, index) => {
                    return (
                        <Paper 
                            className={classes.member}
                            elevation={3}    
                            key={'' + index}            
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
                            <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu.bind(null, member.id)}
                        color="inherit"
                    >
                        <MoreVertIcon />
                    </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl ? anchorEl[member.id] : null}
                                anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                                }}
                                open={open[member.id] ? open[member.id] : false}
                                onClose={handleClose.bind(null, member.id)}
                            >
                                <div>
                                    <MenuItem onClick={handleRole.bind(null, member.id, member.role)}>Changer role</MenuItem>
                                    {((member.adminRole === AdminRoleEnum.MEMBER || isOwner) && currentUser && (member.id !== currentUser.id) ) ? <MenuItem onClick={handleDelete.bind(null, member.id)}>Retirer le membre du projet</MenuItem> : null}
                                    {isOwner && member.adminRole === AdminRoleEnum.MEMBER ? <MenuItem onClick={handleProm.bind(null, member.id)}>Promouvoir Admin</MenuItem> : null}
                                    {isOwner && member.adminRole === AdminRoleEnum.ADMIN ? <MenuItem onClick={handleRetr.bind(null, member.id)}>Rétrograder Membre</MenuItem> : null}
                                </div>
                            </Menu>
                        </Paper>
                    );
                })}
            </div>
            <Modal
                open={openRole}
                onClose={handleCloseRole}
            >
                <div className={classes.modal}>
                    <Typography className={classes.titleModal}>Changer le role du membre</Typography>
                    <Typography className={classes.margin}>ancien role : {oldRole}</Typography>
                    <form onSubmit={handleSubmit(onSubmitRole)}>
                        <TextField
                            className={classes.role}
                            name="role"
                            label={<Typography>Role du membre</Typography>}
                            inputRef={register({required: true})}
                            error={errors.role}
                            helperText="Le role est obligatoire"
                        />
                        <Button className={classes.margin} type="submit" variant="outlined" color="primary">Changer</Button>
                        <Button className={classes.margin} onClick={handleCloseRole}  variant="outlined" color="secondary">annuler</Button>
                    </form>
                </div>
            </Modal>
            <Modal
                open={openDelete}
                onClose={handleCloseDelete}
            >
                <div className={classes.modal}>
                    <Typography className={classes.titleModal}>Voullez vous vraiment retirer le membre du projet ?</Typography>
                    <Button className={classes.margin} onClick={isOwner ? handleBtnOwnerDelete : handleBtnDelete} variant="outlined" color="primary">Retirer</Button>
                    <Button className={classes.margin} onClick={handleCloseDelete}  variant="outlined" color="secondary">annuler</Button>
                </div>
            </Modal>
        </div>
    );
}

export default ManageMember;