import React, { FC, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, makeStyles } from "@material-ui/core";
import { Menu as MenuIcon, AccountCircle } from "@material-ui/icons";
import useAuth from "../hooks/useAuth";
import { useUserConnected } from "../hooks/useToken";
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

    const history = useHistory();
    const classes = useStyles();
    const auth = useAuth();
    const user = useUserConnected();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleOpenProfil = () => {
        setAnchorEl(null);
        history.push('/profil/'+user.id);
    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleDeconnexion = () => {
        setAnchorEl(null);
        auth.logout();
    }

    return (
        <AppBar position="sticky">
            <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                {user.firstName + ' ' + user.lastName}
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
                    <MenuItem onClick={handleOpenProfil}>Profile</MenuItem>
                    <MenuItem onClick={handleDeconnexion}>Déconnecter</MenuItem>
                </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default NavBar;