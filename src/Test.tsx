import React from 'react';
import { useTimer } from './UseTimer';

const Test: React.FC = () => {
    const { isPaused, pause, resume } = useTimer(() => console.log('END'), 10000, { autoInvoke: false });

    console.log(isPaused);

    return (
        <button onClick={() => isPaused ? resume() : pause()}>
            {isPaused ? `Resume` : 'Pause'}
        </button>
    );
};

export default Test;
