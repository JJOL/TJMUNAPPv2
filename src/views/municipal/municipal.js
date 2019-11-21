
const { ipcRenderer } = require('electron');

const storage  = require('../../storage');
const Language = require('../../languages');
const language = new Language(__dirname);

const components = require('../un/components');
const ImageFlagComponent = require('../common/components/imageflag');
const TimerComponent     = require('../common/components/timer');
const SpeakerListComponent = components.SpeakerListComponent;
const TitleComponent = require('../common/components/title');
const MultiLabelInfoComponent = require('../common/components/info').MultiLabelInfoComponent;
const StateInfoComponent = require('../common/components/info').StateInfoComponent;
const WarningsComponent = require('../common/components/warnings');

let backBtn, imageFlagCont, timerCont, speakerListCont, titleCont, topicsCont, chairsCont, stateCont, warningsCont;

function init () {

    const MUNICIPAL_FLAG_IMG_PATH = '../common/assets/queretaro_flag.svg';
    console.log('QUE PEDO');
    
    let sId = storage.getObj('session-active', -1);
    let delegates = storage.getObj('delegates-activated', []);
    let unsession = storage.getObj('s-'+sId+'-data', {});
    let meta      = storage.getObj('s-'+sId, {});


    // Speaker List and Timer
    imageFlagCont = new ImageFlagComponent('#flagImg-component', language, MUNICIPAL_FLAG_IMG_PATH, unsession.imgFlagPath)
    timerCont = new TimerComponent('#timer-component', language, unsession.defaultTime);
    speakerListCont = new SpeakerListComponent('#speakerList-component', language, delegates, unsession.savedSpeakers);

    // Info
    titleCont  = new TitleComponent('#title-component', language, meta.name);
    topicsCont = new MultiLabelInfoComponent('#topics-component', language, unsession.topics);
    chairsCont = new MultiLabelInfoComponent('#chairs-component', language, unsession.chairs);
    let unStateStrMap = {
        ROLL_CALLING: 'state_roll_calling',
        DRAFT_RESOLUTION: 'state_draft_resolution',
        MODERATED_CAUCUS: 'state_moderated_caucus',
        UNMODERATED_CAUCUS: 'state_unmoderated_caucus',
        SPEAKERS_LIST: 'state_speakers_list'
    };
    stateCont  = new StateInfoComponent('#sessionState-component', language, unStateStrMap, 'ROLL_CALLING', unsession.state);

    // Warnings
    warningsCont = new WarningsComponent('#warnings-component', language, delegates, unsession.warnings);

    timerCont.onDefaultTimeChanged((newDefTime) => {
        unsession.defaultTime = newDefTime;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    speakerListCont.onCurrentSpeakerChanged((delegate) => {
        if (delegate) {
            unsession.imgFlagPath = delegate.path;
        } else {
            unsession.imgFlagPath = MUNICIPAL_FLAG_IMG_PATH;
        }
        imageFlagCont.setCurrentImage(unsession.imgFlagPath);
        storage.setObj('s-'+sId+'-data', unsession);
    });

    speakerListCont.onSpeakerListChanged((speakers) => {
        unsession.savedSpeakers = speakers;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    topicsCont.onInfoChange((newInfo) => {
        unsession.topics = newInfo;
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