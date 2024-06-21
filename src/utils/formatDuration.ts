import moment from "moment";

/**
 * Print a duration as human readable.
 * @param input [milliseconds]
 */
export default function formatDuration(input: number) {
    const duration = moment.duration(input);

    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours() % 24);
    const minutes = Math.floor(duration.asMinutes() % 60);

    // Only show the seconds if the duration is less than 1 minute.
    const seconds = !minutes ? Math.floor(duration.asSeconds() % 60) : null;

    let msg = "";

    if (days) msg += `${days} ${days > 1 ? "days " : "day "}`;
    if (hours) msg += `${hours} ${hours > 1 ? "hours " : "hour "}`;
    if (minutes) msg += `${minutes} ${minutes > 1 ? "minutes " : "minute "}`;
    if (seconds) msg += `${seconds} ${seconds > 1 ? "seconds " : "second "}`;

    return msg;
}
