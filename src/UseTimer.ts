import React from 'react';

type TUseTimer = (
    callback: (...params: Array<any>) => void,
    delay: number,
    options: { autoInvoke: boolean },
) => any;

export const useTimer: TUseTimer = (callback, delay, options = { autoInvoke: false }) => {
    // Use of react hooks
    const [isPaused, setIsPaused] = React.useState(!options.autoInvoke);
    const savedCallback = React.useRef(callback);
    const delayRef = React.useRef(delay);
    const savedDelayRef = React.useRef(delay);
    const startTimeRef = React.useRef(Date.now());
    const remainingTimeRef = React.useRef(delay);
    const timerRef = React.useRef<number|null>(null);
  
    const clear = React.useCallback(() => {
        if (null !== timerRef.current) {
            clearTimeout(timerRef.current);
            setIsPaused(true);
            timerRef.current = null;
        }
    }, []);
  
    const pause = React.useCallback(() => {
        savedDelayRef.current = Math.max(0, savedDelayRef.current - (Date.now() - startTimeRef.current));
        setIsPaused(true);
        clear();
    }, [clear]);
  
    const resume = React.useCallback(() => {
        setIsPaused(false);
        remainingTimeRef.current = savedDelayRef.current;

        if (null === timerRef.current) {
            timerRef.current = setTimeout(() => {
                null !== savedCallback && savedCallback.current();
                setIsPaused(true);
                timerRef.current = null;
            }, remainingTimeRef.current);

            startTimeRef.current = Date.now();
        }
    }, []);
  
    React.useEffect(() => {
        true === options.autoInvoke && resume();

        return clear;
    }, [resume, clear]);
  
    React.useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);
  
    React.useEffect(() => {
        null !== timerRef.current && clear();

        delayRef.current = remainingTimeRef.current = savedDelayRef.current = delay;
    }, [delay, clear]);
  
    return { clear, pause, resume, isPaused };
  }