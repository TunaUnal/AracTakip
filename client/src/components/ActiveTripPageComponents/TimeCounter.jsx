import React from 'react'
import { format, differenceInMinutes } from 'date-fns';
import { tr } from 'date-fns/locale'; // Türkçe aylar ve günler için
import { useState, useEffect } from 'react';
function TimeCounter({ time }) {
    const [elapsedTotalMinutes, setElapsedTotalMinutes] = useState(0);

    useEffect(() => {
        // startTime bir string ("2025-08-01..."), onu Date objesine çeviriyoruz.
        const tripStartTime = new Date(time);
        setElapsedTotalMinutes(differenceInMinutes(new Date(), tripStartTime));
        // Timer mantığı tamamen aynı, sadece burada
        const timer = setInterval(() => {
            setElapsedTotalMinutes(differenceInMinutes(new Date(), tripStartTime));
        }, 1000);

        // Temizleme fonksiyonu
        return () => clearInterval(timer);
    }, []); // Sadece startTime prop'u değişirse bu effect baştan kurulur.

    // Hesaplama mantığı tamamen aynı
    const hours = Math.floor(elapsedTotalMinutes / 60);
    const minutes = elapsedTotalMinutes % 60;



    return (
        <>
            {hours > 0 ? hours + " saat " + minutes + " dakika" : minutes + " dakika"}

        </>
    )
}

export default TimeCounter