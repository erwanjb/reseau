import React, { FC } from 'react';
import ButtonProfil from './ButtonProfil';
import NavBar from "./NavBar";
import logo from '../logo.svg';

const Home: FC = () => {

    return (
        <div>
            <NavBar></NavBar>
            <ButtonProfil></ButtonProfil>
            <h1>
                HOME 
            </h1>
            <img src={logo} />
        </div>
    );
};

export default Home;