/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

type TUseCountdown = (
  delay: number,
  /** Must  */
  updateInterval: number,
  callback?: ((...params: Array<any>) => void)|undefined,
  options?: { autoInvoke: boolean }|undefined,
) => any;

export const useCountdown: TUseCountdown = (
    delay,
    updateInterval,
    callback = undefined,
    options = { autoInvoke: false }
) => {
    const [remainingTime, setRemainingTime] = React.useState<number>(delay);
    const [paused, setPaused] = React.useState<boolean>(!options.autoInvoke);
    const [ended, setEnded] = React.useState<boolean>(false);
    const countdown = React.useRef<{
        remainingTime?: number|undefined,
        delay?: number|undefined,
        lastInterval?: number|undefined,
        started?: number|undefined,
        requestId?: number|undefined,
    }>({});

    const run = React.useCallback((currentTimestamp: number) => {
        const localInterval = Math.min(updateInterval, countdown.current.remainingTime || Infinity);

        if (undefined === countdown.current.started) {
            countdown.current.started = currentTimestamp;
            countdown.current.lastInterval = currentTimestamp;
        }

        if (localInterval <= currentTimestamp - countdown.current.lastInterval!) {
            countdown.current.lastInterval! += localInterval;
            setRemainingTime(remainingTime => {
                countdown.current.remainingTime = remainingTime - localInterval;

                return countdown.current.remainingTime;
            });
        }

        if (currentTimestamp - countdown.current.started < countdown.current.delay!) {
            countdown.current.requestId = window.requestAnimationFrame(run);
        } else {
            countdown.current = {};
            setRemainingTime(0);
            setPaused(true);
            setEnded(true);
            undefined !== callback && callback();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateInterval]);

    const start = React.useCallback((withDelay?: number|undefined) => {
        const delayToUse = undefined === withDelay ? delay : withDelay;

        window.cancelAnimationFrame(countdown.current.requestId!);
        countdown.current.started = undefined;
        countdown.current.lastInterval = undefined;
        countdown.current.delay = delayToUse;
        countdown.current.requestId = window.requestAnimationFrame(run);
        setRemainingTime(delayToUse);
        setPaused(false);
        setEnded(false);
    }, [delay, run]);

    const pause = React.useCallback(() => {
        window.cancelAnimationFrame(countdown.current.requestId!);
        countdown.current.started = undefined;
        countdown.current.lastInterval = undefined;
        countdown.current.delay = countdown.current.remainingTime;
        setPaused(true);
    }, []);

    const resume = React.useCallback(() => {
        if (undefined === countdown.current.started && 0 < countdown.current.remainingTime!) {
            window.cancelAnimationFrame(countdown.current.requestId!);
            countdown.current.requestId = window.requestAnimationFrame(run);
            setPaused(false);
        }
    }, [run]);

    const reset = React.useCallback(() => {
        if (undefined !== countdown.current.remainingTime) {
            window.cancelAnimationFrame(countdown.current.requestId!);
            countdown.current = {};
        }

        setRemainingTime(delay);
        setPaused(true);
        setEnded(false);
    }, [delay]);

    const actions = React.useMemo(() =>
        ({ pause, reset, resume, start })
    , [pause, reset, resume, start]);

    React.useEffect(() => {
        undefined !== options && true === options.autoInvoke &&
            start();

        return () => window.cancelAnimationFrame(countdown.current.requestId!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start]);

  return { remainingTime, paused, ended, actions };
}
