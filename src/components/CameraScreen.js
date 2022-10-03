import React, { useRef, useEffect, useState } from 'react';
import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';

import SettingsModal from './SettingsModal';

import './cameraScreen.css';
import './animate.compat.css';
import useCameraScreen from './useCameraScreen';

//Variables de configuracion de enfoque y resolucion de la camara
const facingMode = FACING_MODES.ENVIRONMENT;
const idealResolution = { width: 640, height: 480 };

const CameraScreen = () => {
    /** Hooks */
    const {changeCamera} = useCameraScreen();

   

    const [isCameraReady, setIsCameraReady] = useState(false);
    const [photoTaken, setPhotoTaken] = useState(false);
    const [imageToDownload, setImageToDownload] = useState('#');
    const [showModal, setShowModal] = useState(false);
    const [isTimerSet, setIsTimerSet] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [counter, setCounter] = useState(3);
    const [showCounter, setShowCounter] = useState(false);
    

    //Crear referencia para tomar el html de video
    const videoRef = useRef();
    let cameraPhoto = new CameraPhoto(videoRef.current);

    useEffect(() => {

        //Instanciar la libreria e iniciar la camara
        // eslint-disable-next-line
        cameraPhoto = new CameraPhoto(videoRef.current);

        console.log(cameraPhoto.inputVideoDeviceInfos)
        startCamera(facingMode, idealResolution);
            
        if(window.innerWidth < 1200) {
            window.addEventListener("orientationchange", (e) => {
                const popUp = document.querySelector('.rotatePop');

                if(window.orientation === 0) {
                    popUp.style.display = 'flex';    
                } else {
                    popUp.style.display = 'none';
                }
            });
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
        .then(res => {
            let devices = res.filter((item) => item.kind === "videoinput");
            console.log(devices[0].deviceId);
            console.log(cameraPhoto)
            cameraPhoto.startCameraMaxResolution(devices[0].deviceId).then((res) => console.log("starting camera")).catch(err => console.log(err));
        }).catch((err) => err)
        // changeCamera(cameraPhoto);
        // eslint-disable-next-line
    }, [])

    const startCamera = (idealFacingMode, idealResolution) => {
        cameraPhoto.startCamera(idealFacingMode, idealResolution)
            .then(() => {
                console.log('camera is started !');
                setIsCameraReady(true);
            })
            .catch((error) => {
                alert(error);
            });
        
    }

    // Pintar foto en canvas
    const displayPicture = (uri) => {

        const canvas = document.getElementById('photo');
        const ctx = canvas.getContext('2d');
    
        const image = new Image();
        
        image.onload = function() {
            ctx.drawImage(image, canvas.width * 0.1, 0, 470, 350);

            const frame = new Image();
        
            frame.onload = function() {
                ctx.drawImage(frame, 0, 0, 670, 350);
                setImageToDownload(canvas.toDataURL('image/jpg'));
            };

            frame.src = './assets/images/frame.png';
        };
        
        image.src = uri;

    };

    // Tomar la foto
    const takePhoto = () => {
        const config = {
            sizeFactor: 1
        };

        if(isTimerSet) { //Cuando se activa el temporizador

            setShowCounter(true);

            setTimeout(() => { setCounter(2) }, 1000);
            setTimeout(() => { setCounter(1) }, 2000);

            setTimeout(() => {
                const dataUri = cameraPhoto.getDataUri(config);
                
                displayPicture(dataUri);
                setPhotoTaken(true);
            }, 3000);
        } else {
            const dataUri = cameraPhoto.getDataUri(config);
            
            displayPicture(dataUri);
            setPhotoTaken(true);
        }
    }

    //Reiniciar camara 
    const restartCamera = () => {
        // Limpiar canvas, contador de timer y volver a mostrar la camara
        setPhotoTaken(false);
        setCounter(3);
        setShowCounter(false);

        const canvas = document.getElementById('photo');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    };

    return (
        
        
        <div className="main-container_camera animated fadeIn">
            <div className='logo-poto1'>
                <img src="./assets/images/logo.png" alt=""/>
            </div>
            <RotateDevicePop />
            
            {
                photoTaken && 
                <h2 className="blue animated fadeInLeft">
                    <span className="pink">¡Te ves genial! ████</span> <br />
                    ████ Guarda tu foto
                </h2>
            }

            <div className="video-wrapper_camera">
                <div 
                    className="initial-img_camera"
                    style={{ display: photoTaken ? 'none' : 'block' }}
                >
                    <img src="./assets/images/frame.png" alt="marco"/>
                    <video
                        ref={videoRef}
                        autoPlay={true}
                    />  
                    
                    {
                        (showCounter) &&
                        <div className="timer_camera">
                            { counter }
                        </div>
                    }
                </div>

                <canvas 
                    className="animated fadeIn"
                    id="photo" 
                    width="650" 
                    height="350"
                    style={{ display: photoTaken ? 'block' : 'none' }}
                ></canvas>
            </div>
            <div className='logo-poto'>
                <img src="./assets/images/foto2.png" alt=""/>
            </div>

            {
                !photoTaken 
                ?
                    <div className="btns-wrapper_camera">
                        <div className="div-wrapper">
                            <button
                                className="settings-btn_camera"
                                onClick={() => setShowModal(true)}
                            ></button>
                            <button
                                className="take-btn_camera"
                                onClick={ takePhoto }
                                disabled={ !isCameraReady }
                            ></button>
                        </div>
                    </div>
                :
                    <div className="btns-wrapper_camera">
                        <div className="div-wrapper">
                            <div className='trie'>
                                <button
                                    className="try-btn_camera"
                                    onClick={ restartCamera }
                                    ></button>
                                {/* <p className="blue">Descarta esta foto <br /> e intenta de nuevo</p> */}
                            </div>
                            <div className='guardar'>
                                {/* eslint-disable-next-line */}
                                <a
                                    id="download"
                                    className="save-btn_camera"
                                    download="selfie"
                                    href={ imageToDownload }
                                ></a>
                                {/* <p className="pink">Guarda tu foto</p> */}
                            </div>
                        </div>
                    </div>
                    
                    
            }

            {/* MODAL DE CONFIGURACIONES */}
            {
                showModal &&
                <SettingsModal 
                    setShowModal={ setShowModal } 
                    isTimerSet={ isTimerSet }
                    setIsTimerSet={ setIsTimerSet }
                    setIsFullScreen={ setIsFullScreen }
                    isFullScreen={ isFullScreen }
                />
            }
        </div>
    );
};

const RotateDevicePop = () => {
    return (
        <div className="rotatePop">
            <div className="icon-box">
                <div className="icon-wrapper animated shakeX">
                    <img src="./assets/images/icon.png" alt="rotate"/>
                </div>
            </div>
            <div className="text-box">
                <p>
                    Por favor gira tu dispositivo
                </p>
            </div>
        </div>
    )
}


export default CameraScreen;
