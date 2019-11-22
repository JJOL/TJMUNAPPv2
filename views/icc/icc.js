
const { ipcRenderer } = require('electron');

const storage  = require('../../storage');
const Language = require('../../languages');
const language = new Language(__dirname);

const TimerComponent     = require('../common/components/timer');
const TitleComponent = require('../common/components/title');
const StateInfoComponent = require('../common/components/info').StateInfoComponent;

const translateStaticElements = require('../common/js/language-utils').translateStaticElements;

let backBtn, sessionStateCont, mainTimerCont,  defenseStateCont, prosecutionStateCont, defenseTimerCont, prosecutionTimerCont, titleCont;

function init () {

    let sId = storage.getObj('session-active', -1);
    let unsession = storage.getObj('s-'+sId+'-data', {});
    let meta      = storage.getObj('s-'+sId, {});

    let iccMainStateStrMap = {
        MODERATED_CAUCUS: 'state_moderated_caucus',
        WITNESS_PRESENTATION: 'state_witness_presentation',
        EVIDENCE_PRESENTATION: 'state_evidence_presentation'
    };

    let iccLawerStatesStrMap = {
        JUDICIAL_QUERY: 'state_judicial_query',
        OPENING_STATEMENT: 'state_opening_statement',
        CLOSING_STATEMENT: 'state_closing_statement'
    }

    // Titulos de Speaker
    translateStaticElements(document, language);

    // Main Session
    titleCont  = new TitleComponent('#title-component', language, meta.name);
    sessionStateCont = new StateInfoComponent('#sessionState-component', language, iccMainStateStrMap, 'WITNESS_PRESENTATION', unsession.mainState);
    mainTimerCont = new TimerComponent('#mainTimer-component', language, unsession.defaultMainTime);

    // Defense 
    defenseStateCont = new StateInfoComponent('#defenseState-component', language, iccLawerStatesStrMap, 'OPENING_STATEMENT', unsession.defenseState);
    defenseTimerCont = new TimerComponent('#defenseTimer-component', language, unsession.defaultDefenseTime);

    // Prosecution
    prosecutionStateCont = new StateInfoComponent('#prosecutionState-component', language, iccLawerStatesStrMap, 'OPENING_STATEMENT', unsession.prosecutionState);
    prosecutionTimerCont = new TimerComponent('#prosecutionTimer-component', language, unsession.defaultProsecutionTime);
 
    // State Controllers
    sessionStateCont.onInfoChange((newInfo) => {
        unsession.mainState = newInfo;
        storage.setObj('s-'+sId+'-data', unsession);
    });
    defenseStateCont.onInfoChange((newInfo) => {
        unsession.defenseState = newInfo;
        storage.setObj('s-'+sId+'-data', unsession);
    });
    prosecutionStateCont.onInfoChange((newInfo) => {
        unsession.prosecutionState = newInfo;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    // Timer Controllers
    mainTimerCont.onDefaultTimeChanged((newDefTime) => {
        unsession.defaultMainTime = newDefTime;
        storage.setObj('s-'+sId+'-data', unsession);
    });
    defenseTimerCont.onDefaultTimeChanged((newDefTime) => {
        unsession.defaultDefenseTime = newDefTime;
        storage.setObj('s-'+sId+'-data', unsession);
    });
    prosecutionTimerCont.onDefaultTimeChanged((newDefTime) => {
        unsession.defaultProsecutionTime = newDefTime;
        storage.setObj('s-'+sId+'-data', unsession);
    });   

    // Back Btn
    backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', () => {
        ipcRenderer.send('goto-view', 'menu');
    });
}