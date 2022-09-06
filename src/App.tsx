import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import './components/CardLayout'
import CardLayout from "./components/CardLayout";

function App() {
    const [attempts, setAttempts] = useState(1);

    const handlePlayAgain = () => {
        setAttempts(attempts + 1);
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p className="lead"><strong>React to my card trick ...</strong></p>
            </header>

            <CardLayout key={attempts} attemptHandler={handlePlayAgain} />
            <br />
            <footer className="App-header">
                <br />
                Have fun while you learn by Estep Software Forensics!<br />
                <small>
                    <a className="App-link" href="https://github.com/dgestep/ReactCardTrick">GET THE CODE AT GITHUB</a>
                </small>
                <br /><br />
            </footer>
        </div>
    );
}

export default App;
