import React, { useState } from 'react';

import MainScreen from './components/MainScreen';
import PermissonScreen from './components/PermissonScreen';
import CameraScreen from './components/CameraScreen';

const PhotoBooth = () => {

    const [screenToShow, setScreenToShow] = useState('main');

    return (
        <>

        {
            (screenToShow === 'main') &&
            <MainScreen 
                setScreenToShow={ setScreenToShow } 
            />
        }

        {
            (screenToShow === 'permisson') &&
            <PermissonScreen 
                setScreenToShow={ setScreenToShow } 
            />
        }

        {
            (screenToShow === 'camera') &&
            <CameraScreen />
        }

        </>
    );
};


export default PhotoBooth;
