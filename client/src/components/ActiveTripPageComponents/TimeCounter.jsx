import { differenceInMinutes, min } from 'date-fns';
import { useState, useEffect, memo } from 'react';
function TimeCounter({ time }) {
    console.log(time)
    const [elapsedTotalMinutes, setElapsedTotalMinutes] = useState(0);

    useEffect(() => {
        const tripStartTime = new Date(time);
        setElapsedTotalMinutes(differenceInMinutes(new Date(), tripStartTime));
    }, [time]);

    // Hesaplama mantığı tamamen aynı
    const hours = Math.floor(elapsedTotalMinutes / 60);
    const minutes = elapsedTotalMinutes % 60;


    return (
        <>
            {hours > 0 ? hours + " saat " + minutes + " dakika" : minutes + " dakika"}

        </>
    )
}

export default memo(TimeCounter)