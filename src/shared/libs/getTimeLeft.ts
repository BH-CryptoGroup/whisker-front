export function getTimeLeftFromTimestamp(timestamp: string): string {
    console.log('timestamp', timestamp);

    const now = new Date();
    const targetTime = new Date(new Date(timestamp).getTime() + 6 * 60 * 60 * 1000); // Adjusted target time

    const timeDiff = targetTime.getTime() - now.getTime();

    if (timeDiff <= 0) {
        return 'now';
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    if (hours >= 2) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (hours === 1) {
        return `${2} hours`;
    } else if (minutes >= 2) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 1) {
        return `${2} minutes`;
    } else {
        return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
}

