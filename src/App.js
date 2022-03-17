import React from "react";
import { Grid } from '@material-ui/core';
import './App.css';
import ReactClock from "./react-clock/ReactClock";
import MoonPhase from "./moon-phase/MoonPhase";


function App() {

  return (
    <div className="App">
        <header className="App-header">
            <Grid container align="center" alignItems="center" justify="center">
                <Grid item xs={6}>
                    <MoonPhase />
                </Grid>
                <Grid item xs={6}>
                    <ReactClock size={250} />
                </Grid>
            </Grid>
        </header>
    </div>
  );
}

export default App;
