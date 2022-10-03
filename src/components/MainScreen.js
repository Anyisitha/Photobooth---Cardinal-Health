import React from 'react';
import PropTypes from 'prop-types';

import './mainScreen.css';
import './animate.compat.css';

const MainScreen = ({ setScreenToShow }) => {

    return (
        <div className="main-container_main animated fadeIn">
            <header className="header_main">
                <section className="title-section_main">
                    <div className="logo-wrapper_main">
                        <img
                            src="./assets/images/logo.png"
                            alt="preview"
                        />  
                    </div> 
                </section>
                <section className="btn-section_main">
                <div 
                    className="start-wrapper_main"
                    onClick={ () => setScreenToShow('permisson') }
                >
                    <h1>
                        <span >¡Bienvenido, ██</span> <br />
                        ██ comienza aquí!
                    </h1>
                </div>
                </section>
            </header>

            <main className="main_main">
                <div className="preview-wrapper_main">
                    <img
                        src="./assets/images/preview.png"
                        alt="preview"
                    />
                </div>

                <h2>Así se verá tu foto</h2>
            </main>

            <div className='logo-poto'>
                <img src="./assets/images/foto2.png" alt=''/>
            </div>
        </div>

    );
};

MainScreen.propTypes = {
    setScreenToShow: PropTypes.func.isRequired
};

export default MainScreen;
