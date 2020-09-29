import React, { FC, useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, makeStyles } from "@material-ui/core";
import { Menu as MenuIcon, AccountCircle } from "@material-ui/icons";
import useAuth from "../hooks/useAuth";
import  { useUserConnected } from "../hooks/useToken";
import { useHistory } from 'react-router-dom';

const NavBar: FC = () => {

    const useStyles = makeStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: 30,
        },
        title: {
            flexGrow: 1,
        },
    });
    const user = useUserConnected();

    useEffect(() => {

    }, [user])

    const history = useHistory();
    const classes = useStyles();
    const auth = useAuth();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleOpenProfil = (id) => {
        setAnchorEl(null);
        history.push('/profil/' + id);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleDeconnexion = () => {
        setAnchorEl(null);
        auth.logout();
    }

    const handleLogo = () => {
        history.push('/');
    }

    const handleConnexion = () => {
        history.push('/connexion');
    }

    const handleOpenMessaging = () => {
        history.push('/messaging');
    }

    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton
                    edge="start"
                    aria-label="logo"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleLogo}
                    color="inherit"
                >
                    <Typography>Réseau</Typography>
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    { user ? user.firstName + ' ' + user.lastName : null}
                </Typography>
                <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        {user ? <div><MenuItem onClick={handleOpenProfil.bind(null, user.id)}>Profil</MenuItem><MenuItem onClick={handleOpenMessaging}>Messagerie</MenuItem><MenuItem onClick={handleDeconnexion}>Déconnecter</MenuItem></div> : <MenuItem onClick={handleConnexion}>Se connecter</MenuItem>}
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;