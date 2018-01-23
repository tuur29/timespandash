

function convertToHoursAndMinutes(time: number): string {
    var string = time.toString().split(".");
    var mins = Math.round( parseFloat("0."+string[1]) * 60 );
    return Math.round(parseInt(string[0])) + "h " + mins + "min";
}

function prependZero(i: number): string {
    return (i < 10 ? "0" : "") + i;
}

export function round(n): number {
    return Math.round(n*100)/100;
}

export function convertTime(value: number): string {
    let min = value/60000;

    if (min<60)
        return round(min) + "min";
    else if (min/60<24)
        return convertToHoursAndMinutes( min/60 );
    else if (min/(60*24)<7)
        return round(min/(60*24)) + "d";
    else if (min/(60*24)<30)
        return round(min/(60*24*7)) + "w";
    else if (min/(60*24)<365)
        return round(min/(60*24*30)) + "mon";
    else
        return round(min/(60*24*365)) + "y";
}

export function formatDate(date: Date): string {
    return date.getFullYear() + "-" + prependZero(date.getMonth()+1) + "-" + prependZero(date.getDate());
}

export function formatTime(date: Date): string {
    return prependZero(date.getHours()) + ":" + prependZero(date.getMinutes());
}

export function formatTimestamp(date: Date): string {
    return formatDate(date) + " " + formatTime(date);
}

export function formatShortTimestamp(date: Date): string {
    let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[date.getMonth()] + " " + date.getDate() + " " + formatTime(date);
}


