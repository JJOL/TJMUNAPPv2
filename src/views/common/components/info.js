const translateStaticElements = require('../js/language-utils').translateStaticElements;

class MultiLabelInfoComponent {
    constructor(elId, language, items) {
        this.container = document.querySelector(elId);

        this.frontCont = this.container.querySelector('.front-section');
        this.backCont = this.container.querySelector('.back-section');
        this.frontList = this.frontCont.querySelector('ul');
        this.backList = this.backCont.querySelector('ul');

        this.addBtn = this.container.querySelector('#add-btn');
        this.okBtn = this.container.querySelector('#ok-btn');

        this.language = language;
        this.fn = null;
        this.isOpen = true;
        this.items = items || [];
        
        this.container.addEventListener('click', () => {
            if (!this.isOpen) {
                this.openInput();
            }
        });

        this.okBtn.addEventListener('click', (event) => {    
            event.stopPropagation();       
            this.closeInput();
        });

        this.addBtn.addEventListener('click', (event) => {    
            event.stopPropagation();       
            this.addItemInput();
        });

        this.closeInput();
        
    }

    renderFront() {
        var htmlStr = '';
        for (let it of this.items) {
            htmlStr += `<li>${it}</li>`;            
        }
        this.frontList.innerHTML = htmlStr;
    }

    renderBack() {
        this.backList.innerHTML = '';
        let items = this.items.slice();
        Object.assign(items, this.items);
        for (let i=0; i < items.length; i++) {
            let inIndex = i;
            let it = items[i];
            let el = document.createElement('li');
            let inpEl = document.createElement('input');
            inpEl.value = it;
            let btnEl = document.createElement('button');
            btnEl.innerHTML = 'X';

            inpEl.addEventListener('keypress', (ev) => {
                if (ev.key == 'Enter') {
                    this.closeInput();
                }
            });

            btnEl.addEventListener('click', () => {
                this.items.splice(inIndex, 1);
                this.renderBack();
            });

            el.appendChild(inpEl);
            el.appendChild(btnEl);
            this.backList.appendChild(el);
        }
    }

    addItemInput() {
        this.items.push('');
        this.renderBack();
    }

    openInput() {
        this.backCont.style.display = 'block';
        this.frontCont.style.display = 'none';
        this.isOpen = true;

        this.renderBack();
    }

    closeInput() {
        this.backCont.style.display = 'none';
        this.frontCont.style.display = 'block';
        this.isOpen = false;
 
        let inputs = Array.from(this.backList.querySelectorAll('input'));
        for (let i=0; i < inputs.length; i++) {
            this.items[i] = inputs[i].value;
        }

        if (this.fn) {
            this.fn(this.items);
        }

        this.renderFront();
    }

    onInfoChange(fn) {
        this.fn = fn;
    }
}

module.exports.MultiLabelInfoComponent = MultiLabelInfoComponent;