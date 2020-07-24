import React, { FC } from 'react';
import ButtonProfil from './ButtonProfil';
import logo from '../logo.svg'

const Home: FC = () => {
    return (
        <div>
            <ButtonProfil></ButtonProfil>
            <h1>
                HOME 
            </h1>
            <img src={logo} />
        </div>
    );
};

export default Home;