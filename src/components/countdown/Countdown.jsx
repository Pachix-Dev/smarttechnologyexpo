import { useEffect, useState } from "react";

export default function Countdown({
    daysLabel,
    hoursLabel,
    minutesLabel
}) {
    const calculateTime= () => {
        const targetDate = new Date(
            "2026-11-18t00:00:00-06:00"
        ).getTime();

    const now = new Date().getTime();
    const distance = targetDate - now;

    if(distance<=0){
        return {
            days:"00",
            hours:"00",
            minutes:"00"
        };
    }

    return {
        days: String(
            Math.floor(distance/(1000 * 60 * 60 * 24))
        ).padStart(2,"0"),

        hours: String(
            Math.floor(
                (distance%(1000 * 60 * 60 * 24))
                /
                (1000 * 60 * 60)
            )
        ).padStart(2,"0"),

        minutes: String(
            Math.floor(
                (distance%(1000 * 60 * 60))
                /
                (1000 * 60)
            )
        ).padStart(2, "0")
        };
    };

    const [time, setTime] = 
    useState(calculateTime());

    useEffect(()=>{
        const interval = setInterval(()=>{
            setTime(calculateTime());
        },1000);

    return () => clearInterval(interval);
    },[]);

    return(
        <div className="flex gap-4 md:gap-7">

        <div className="time-box animate-fade-in animate-duration-1000">

            <span>
                {time.days}
            </span>
            <small>
                {daysLabel}
            </small>

        </div>

        <div className="time-box animate-fade-in animate-duration-1000">

            <span>
                {time.hours}
            </span>
            <small>
                {hoursLabel}
            </small>

        </div>

        <div className="time-box animate-fade-in animate-duration-1000">

            <span>
                {time.minutes}
            </span>

            <small>
                {minutesLabel}
            </small>

        </div>

        </div>
    );
    }
