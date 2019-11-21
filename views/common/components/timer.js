const translateStaticElements = require('../js/language-utils').translateStaticElements;


class TimerComponent {
    constructor(elId, language, savedDefaultTime) {
        this.container = document.querySelector(elId);        
        this.timeLbl = this.container.querySelector('#time-lbl');
        this.startBtn = this.container.querySelector('#time-stt-btn');        
        this.stopBtn = this.container.querySelector('#time-stp-btn');
        this.setBtn = this.container.querySelector('#time-set-btn');
        this.defTimeLbl = this.container.querySelector('#def-time');
        this.defTimeBtn = this.container.querySelector('#in-check');
        this.defTimeMinIn = this.container.querySelector('#min-in');
        this.defTimeSecIn = this.container.querySelector('#sec-in');

        this.language = language;
        this.fn = null;

        this.defaultTime = savedDefaultTime || {
            mins: 10,
            secs: 0
        };
        this.currTime = {};
        this.setDefTimeToCurrTime();

        this.clockIntervalId = -1;

        // Timer Controls
        this.startBtn.addEventListener('click', () => {
            this.startTimer();
            this.startBtn.setAttribute('disabled', true);
            this.stopBtn.removeAttribute('disabled');
        });
        this.stopBtn.addEventListener('click', () => {
            this.stopTimer();
            this.startBtn.removeAttribute('disabled');
            this.stopBtn.setAttribute('disabled', true);
        });
        this.setBtn.addEventListener('click', () => {
            this.setDefTimeToCurrTime();
        });

        // Default Time Controls
        this.defTimeLbl.addEventListener('click', () => {
            this.openClockSet();
        });
        this.defTimeBtn.addEventListener('click', () => {
            this.closeClockSet();
        });
        this.defTimeMinIn.addEventListener('keypress', (ev) => {
            if (ev.key == 'Enter') {
                this.closeClockSet();
            }
        });
        this.defTimeSecIn.addEventListener('keypress', (ev) => {
            if (ev.key == 'Enter') {
                this.closeClockSet();
            }
        });
        
        
        this.render();
        this.stopBtn.setAttribute('disabled', true);
    }

    _timeStr(num) {
        let str = `${num}`;
        for (let i=str.length; i < 2; i++) {
            str = `0${str}`;
        }

        return str;
    }

    _inRange(x) {
        return (0 <= x && x < 60);
    }

    clearCtlBtnStyles() {
        this.startBtn.classList.remove('pushed');
        this.stopBtn.classList.remove('pushed');
        this.setBtn.classList.remove('pushed');
    }

    renderCounter() {
        let minsStr = this._timeStr(this.currTime.mins);
        let secsStr = this._timeStr(this.currTime.secs);
        this.timeLbl.innerHTML = `${minsStr}:${secsStr}s`;
    }

    renderDefaultTime() {
        let minsStr = this._timeStr(this.defaultTime.mins);
        let secsStr = this._timeStr(this.defaultTime.secs);
        this.defTimeLbl.innerHTML = `Default: ${minsStr}:${secsStr}s`;
    }

    render() {
        this.renderCounter();
        this.renderDefaultTime();
        translateStaticElements(this.container, this.language);
    }

    update() {
        let currTime = this.currTime;
        if (currTime.mins == 0 && currTime.secs == 0) {
            // End Of Timer!!
            this.stopTimer();
            this.onTimerEnd();
            this.startBtn.removeAttribute('disabled');
            this.stopBtn.setAttribute('disabled', true);
            return;
        }

        if (currTime.secs > 0) {
            currTime.secs--;
        }
        else {
            currTime.mins--;
            currTime.secs = 59;
        }

        // if (currTime.mins == 0 && currTime.secs == 0) {
        //     // End Of Timer!!
        //     this.stopTimer();
        //     this.onTimerEnd();
        // }

        this.renderCounter();
    }

    openClockSet() {
        this.defTimeMinIn.value = this.defaultTime.mins;
        this.defTimeSecIn.value = this.defaultTime.secs;

        this.defTimeMinIn.classList.add('active');
        this.defTimeSecIn.classList.add('active');
        this.defTimeBtn.classList.add('active');
        this.defTimeLbl.style.display = 'none';
    }

    closeClockSet() {
        let mins = Number(this.defTimeMinIn.value),
            secs = Number(this.defTimeSecIn.value);
        this.defaultTime.mins = this._inRange(mins) ? mins : this.defaultTime.mins;
        this.defaultTime.secs = this._inRange(secs) ? secs : this.defaultTime.secs;
        
        if (this.fn) {
            this.fn(this.defaultTime);
        }
        this.renderDefaultTime();

        this.defTimeMinIn.classList.remove('active');
        this.defTimeSecIn.classList.remove('active');
        this.defTimeBtn.classList.remove('active');
        this.defTimeLbl.style.display = 'block';
    }

    setDefTimeToCurrTime() {
        this.currTime.mins = this.defaultTime.mins;
        this.currTime.secs = this.defaultTime.secs;

        this.renderCounter();
    }

    startTimer() {
        this.clockIntervalId = setInterval(() => {
            this.update();
        }, 1000);
    }

    stopTimer() {
        if (this.clockIntervalId !== -1) {
            clearInterval(this.clockIntervalId);
        }
    }

    onTimerEnd() {

    }

    onDefaultTimeChanged(fn) {
        this.fn = fn;
    }
    
}

module.exports = TimerComponent;