const isEasternDst = (date) => {
    const year = date.getFullYear();
    const secondSunday = (month) => {
        const d = new Date(year, month, 1);
        return 1 + (7 - d.getDay()) % 7 + 7;
    };
    const firstSunday = (month) => {
        const d = new Date(year, month, 1);
        return 1 + (7 - d.getDay()) % 7;
    };
    const start = new Date(year, 2, secondSunday(2), 2, 0, 0);
    const end = new Date(year, 10, firstSunday(10), 2, 0, 0);
    return date >= start && date < end;
};

const tzLabel = document.getElementById('tz-label');
if (tzLabel)
    tzLabel.textContent = isEasternDst(new Date()) ? 'EDT' : 'EST';
