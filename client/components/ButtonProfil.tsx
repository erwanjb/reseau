import React, { FC} from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
    sticky: {
        position: 'sticky',
        top: 0
    }
})
const ButtonProfil: FC = () => {
    const classes = useStyles();
    const history = useHistory();

    const handleClick = () => {
        history.push('/profil/aa');
    }

    return (
        <Button className={classes.sticky} variant="outlined" color='primary' onClick={handleClick} >Profil</Button>
    );
};

export default ButtonProfil;