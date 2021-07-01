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
                    <Grid container>
                        <Grid item xs={12}><MoonPhase moonPhase={3.14/3} /></Grid>
                        <Grid item xs={12}><MoonPhase moonPhase={3 * 3.14/4} /></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <ReactClock />
                </Grid>
            </Grid>
        </header>
    </div>
  );
}

export default App;
