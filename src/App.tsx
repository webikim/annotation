import { createTheme, PaletteMode, ThemeProvider } from '@mui/material';
import { blueGrey, grey } from '@mui/material/colors';
import React from 'react';
import { Cookies } from 'react-cookie'

import MainPage from './pages/MainPage';

const cookies: Cookies = new Cookies();

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      ...blueGrey,
      ...(mode === 'light' && {
        main: blueGrey[700],
      }),
    },
    ...(mode === 'light' && {
      background: {
        default: grey[100],
        paper: grey[100],
      },
    }),
    text: {
      ...(mode === 'light'
        ? {
            primary: grey[900],
            secondary: grey[800],
          }
        : {
            primary: '#fff',
            secondary: grey[500],
          }),
    },
  },
});

const darkModeTheme = createTheme(getDesignTokens('light'));

function App() {
    return (
        <ThemeProvider theme={darkModeTheme}>
            <div className="App">
                <MainPage cookies={ cookies }></MainPage>
            </div>
        </ThemeProvider>
    );
}

export default App;
