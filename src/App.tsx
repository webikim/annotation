import React from 'react';
import { Container } from 'react-bootstrap';
import { Cookies } from 'react-cookie'

import MainPage from './pages/MainPage';

import 'bootstrap/dist/css/bootstrap.min.css';

const cookies: Cookies = new Cookies();

function App() {
    return (
        <Container>
            <MainPage cookies={ cookies }></MainPage>
        </Container>
    );
}

export default App;
