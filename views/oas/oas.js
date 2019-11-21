
const { ipcRenderer } = require('electron');

const storage  = require('../../storage');
const Language = require('../../languages');
const language = new Language(__dirname);

const ImageFlagComponent = require('../common/components/imageflag');
const TimerComponent     = require('../common/components/timer');
const TitleComponent = require('../common/components/title');
const MultiLabelInfoComponent = require('../common/components/info').MultiLabelInfoComponent;
const StateInfoComponent = require('../common/components/info').StateInfoComponent;
const WarningsComponent = require('../common/components/warnings');

const translateStaticElements = require('../common/js/language-utils').translateStaticElements;

let backBtn, imageFlagCont, timerContA, timerContB, titleCont, topicsCont, subtopicsCont, chairsCont, stateCont, warningsCont;

function init () {

    const OAS_FLAG_IMG_PATH = '../common/assets/oas_flag.jpg';

    let sId = storage.getObj('session-active', -1);
    let delegates = storage.getObj('delegates-activated', []);
    let unsession = storage.getObj('s-'+sId+'-data', {});
    let meta      = storage.getObj('s-'+sId, {});

    let oasStateStrMap = {
        MODERATED_CAUCUS: 'state_moderated_caucus',
        UNMODERATED_CAUCUS: 'state_unmoderated_caucus'
    };

    // Titulos de Speaker
    translateStaticElements(document, language);


    // Speaker List and Timer
    imageFlagCont = new ImageFlagComponent('#flagImg-component', language, OAS_FLAG_IMG_PATH, unsession.imgFlagPath)
    timerContA = new TimerComponent('#timer-a-component', language, unsession.defaultTimeA);
    timerContB = new TimerComponent('#timer-b-component', language, unsession.defaultTimeB);

    // Info
    titleCont  = new TitleComponent('#title-component', language, meta.name);
    topicsCont = new MultiLabelInfoComponent('#topics-component', language, unsession.topics);
    subtopicsCont = new MultiLabelInfoComponent('#subtopics-component', language, unsession.subtopics);
    chairsCont = new MultiLabelInfoComponent('#chairs-component', language, unsession.chairs);
    stateCont  = new StateInfoComponent('#sessionState-component', language, oasStateStrMap, 'MODERATED_CAUCUS', unsession.state);

    // Warnings
    warningsCont = new WarningsComponent('#warnings-component', language, delegates, unsession.warnings);

    timerContA.onDefaultTimeChanged((newDefTime) => {
        unsession.defaultTimeA = newDefTime;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    timerContB.onDefaultTimeChanged((newDefTime) => {
        unsession.defaultTimeB = newDefTime;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    topicsCont.onInfoChange((newInfo) => {
        unsession.topics = newInfo;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    subtopicsCont.onInfoChange((newInfo) => {
        unsession.subtopics = newInfo;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    chairsCont.onInfoChange((newInfo) => {
        unsession.chairs = newInfo;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    stateCont.onInfoChange((newInfo) => {
        unsession.state = newInfo;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    warningsCont.onInfoChange((newInfo) => {
        unsession.warnings = newInfo;
        storage.setObj('s-'+sId+'-data', unsession);
    });
 

    backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', () => {
        ipcRenderer.send('goto-view', 'menu');
    });
}