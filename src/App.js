import React, {useEffect, useState} from "react";
import { DateTimeFormatter, LocalDateTime } from "@js-joda/core";
import './App.css';

const dateFormatter = DateTimeFormatter.ofPattern("dd MM uuuu");
const timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

function App() {
  const [ldt, setLdt] = useState(LocalDateTime.now());

  useEffect(() => {
      const intervall = setInterval(() => setLdt(LocalDateTime.now()))
      return () => {
          clearInterval(intervall);
      }
  })

  return (
    <div className="App">
      <header className="App-header">
          <div className="clock">{ldt.format(dateFormatter)}</div>
          <div className="clock">{ldt.format(timeFormatter)}</div>
      </header>
    </div>
  );
}

export default App;
