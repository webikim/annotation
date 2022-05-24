import React from 'react';
import { Cookies } from 'react-cookie'

import MainPage from './pages/MainPage';

const cookies: Cookies = new Cookies();

function App() {
    return (
        <div className="App">
            <MainPage cookies={ cookies }></MainPage>
        </div>
    );
}

export default App;
