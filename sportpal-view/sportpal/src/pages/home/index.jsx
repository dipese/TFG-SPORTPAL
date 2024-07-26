/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Map from '../../componets/map';
import Header from '../../componets/header';
import { useAuth } from '../../context/auth';

const Home = () => {
    const { isAuthenticated } = useAuth();
    console.log(isAuthenticated)
    return (
        <>  
            <Header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}/>
            <Map altura={'98.25vh'} filtrar = {true}/>
        </>
    )
};

export default Home;