import moment from "moment";
import React from "react";

interface CountdownRef {
    requestId: number;
    started: number;
    lastInterval: number;
    timeLeft: number;
    timeToCount: number;
}

interface StartCountdownProps {
    endTime: Date;
    timeInMilliseconds?: number;
}

export interface CountdownObject {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const useCountdown = (timeToCount?: number, interval = 1000) => {
    const [timeLeft, setTimeLeft] = React.useState(0);
    const timer = React.useRef<CountdownRef>({} as any);

    const __run = (ts: number) => {
        if (!timer.current.started) {
            timer.current.started = ts;
            timer.current.lastInterval = ts;
        }

        const localInterval = Math.min(
            interval,
            timer.current.timeLeft || Infinity
        );

        if (ts - timer.current.lastInterval >= localInterval) {
            timer.current.lastInterval += localInterval;

            setTimeLeft((timeLeft) => {
                timer.current.timeLeft = timeLeft - localInterval;
                return timer.current.timeLeft;
            });
        }

        if (ts - timer.current.started < timer.current.timeToCount) {
            timer.current.requestId = window.requestAnimationFrame(__run);
        } else {
            timer.current = {} as any;
            setTimeLeft(0);
        }
    };

    const start = React.useCallback((options?: StartCountdownProps) => {
        window.cancelAnimationFrame(timer.current.requestId);

        if (!options?.endTime && !options?.timeInMilliseconds && !timeToCount) {
            throw new Error("Cannot start countdown without a time");
        }

        let newTimeToCount = timeToCount;
        if (options?.endTime) {
            newTimeToCount = moment(options.endTime).diff(moment.utc());
        } else if (options?.timeInMilliseconds) {
            newTimeToCount = options.timeInMilliseconds;
        }

        timer.current.started = 0;
        timer.current.lastInterval = 0;
        timer.current.timeToCount = newTimeToCount!;
        timer.current.requestId = window.requestAnimationFrame(__run);

        setTimeLeft(newTimeToCount!);
    }, []);

    const pause = React.useCallback(() => {
        window.cancelAnimationFrame(timer.current.requestId);

        timer.current.started = 0;
        timer.current.lastInterval = 0;
        timer.current.timeToCount = timer.current.timeLeft;
    }, []);

    const resume = React.useCallback(() => {
        if (!timer.current.started && timer.current.timeLeft > 0) {
            window.cancelAnimationFrame(timer.current.requestId);
            timer.current.requestId = window.requestAnimationFrame(__run);
        }
    }, []);

    const reset = React.useCallback(() => {
        if (timer.current.timeLeft) {
            window.cancelAnimationFrame(timer.current.requestId);

            timer.current = {} as any;
            setTimeLeft(0);
        }
    }, []);

    React.useEffect(() => {
        return () => window.cancelAnimationFrame(timer.current.requestId);
    }, []);

    const timeLeftAsJSON = React.useMemo((): CountdownObject => {
        const duration = moment.duration(timeLeft);

        return {
            days: Math.floor(duration.asDays()),
            hours: Math.floor(duration.asHours() % 24),
            minutes: Math.floor(duration.asMinutes() % 60),
            seconds: Math.floor(duration.asSeconds() % 60),
        };
    }, [timeLeft]);

    return {
        timeLeft: timeLeft / 1000,
        timeLeftAsJSON,
        start,
        pause,
        resume,
        reset,
    };
};

export default useCountdown;
