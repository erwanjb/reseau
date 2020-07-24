import React, { FC} from 'react';
import { Button } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const ButtonProfil: FC = () => {
    const history = useHistory();

    const handleClick = () => {
        history.push('/profil/aa');
    }

    return (
        <Button variant="outlined" color='primary' onClick={handleClick} >Profil</Button>
    );
};

export default ButtonProfil;