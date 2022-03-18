import React from 'react';
import Grid from '@mui/material/Grid'
import './App.css';
import ReactClock from './react-clock/ReactClock';
import MoonPhase from './moon-phase/MoonPhase';


function App() {

  return (
    <div className="App">
        <header className="App-header">
            <Grid container align="center" alignItems="flex-start" justify="center">
                <Grid item xs={6}>
                    <MoonPhase />
                </Grid>
                <Grid item xs={6}>
                    <ReactClock size={228} />
                </Grid>
            </Grid>
        </header>
    </div>
  );
}

export default App;
