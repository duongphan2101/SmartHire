import React from 'react';

import './Home.css';
import Header from '../../components/Header/Header';
import ChatWithAI from '../../components/Chat-With-AI/ChatWithAI';

const Home: React.FC = () => {
    return (
        <>
            <div className="App">
                <Header />
                <ChatWithAI />
                <div className="containerStyle">
                    <h1>Welcome to SmartHire</h1>
                    <p>This is your homepage. Start exploring our features!</p>
                    <button className="buttonStyle">Get Started</button>
                </div>
            </div>
        </>
    );
};

export default Home;
