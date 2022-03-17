import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './react-clock.css';
import Clock from 'react-clock';

function ReactClock({ size }) {
    const [value, setValue] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(
            () => setValue(new Date()),
            1000
        );

        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <>
            <Clock
                hourHandLength={60}
                hourHandOppositeLength={20}
                hourHandWidth={8}
                hourMarksLength={20}
                hourMarksWidth={8}
                minuteHandLength={90}
                minuteHandOppositeLength={20}
                minuteHandWidth={6}
                minuteMarksWidth={3}
                secondHandLength={75}
                secondHandOppositeLength={25}
                secondHandWidth={3}
                size={size}
                value={value}
            />
        </>
    )
}

ReactClock.propTypes = {
    size: PropTypes.number,
};

ReactClock.defaultProps = {
    size: 200,
};

export default ReactClock
