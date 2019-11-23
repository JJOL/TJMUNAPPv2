class ClockComponent {
    constructor(elId, language) {
        this.container = document.querySelector(elId);
        this.language = language;

        
        this.clockIntervId = setInterval(() => {
            this.render();
        }, 5000);
        this.render();   
    }

    _timeStr(num) {
        let str = `${num}`;
        for (let i=str.length; i < 2; i++) {
            str = `0${str}`;
        }

        return str;
    }

    render() {
        let nowDate = new Date();
        let hrs = nowDate.getHours(),
            mins = nowDate.getMinutes();

        let isLate = hrs >= 12;

        if (isLate) {
            hrs = hrs - 12;
        }

        this.container.innerHTML = `${hrs}:${this._timeStr(mins)}<span class="clock-pm">${isLate ? 'PM' : 'AM'}</span>`;
    }
}

module.exports = ClockComponent;