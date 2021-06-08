import React, {useEffect, useState} from "react";
import { DateTimeFormatter, LocalDateTime } from "@js-joda/core";

const dateFormatter = DateTimeFormatter.ofPattern("dd MM uuuu");
const timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

const TextClock = () => {
    const [ldt, setLdt] = useState(LocalDateTime.now());

    useEffect(() => {
        const intervall = setInterval(
            () => setLdt(LocalDateTime.now()),
            1000)
        return () => {
            clearInterval(intervall);
        }
    })
    return (
        <>
            <div className="clock">{ldt.format(dateFormatter)}</div>
            <div className="clock">{ldt.format(timeFormatter)}</div>
        </ >
    )
}

export default TextClock;
