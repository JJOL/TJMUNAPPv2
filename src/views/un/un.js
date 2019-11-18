

// /* Info Boxes */
// function prepareInfoBox(updateFn) {
//     return function() {
//         var open = false;
//         var jthis = this;
//         var title = $(jthis).find('h3');
//         var front = $(jthis).find('.front-section');
//         var back = $(jthis).find('.back-section');
//         back.hide();

//         $(jthis).click(function() {
//             if (open) return;
//             console.log("Out")
//             back.show();
//             front.hide();
//         });

//         back.find('#add-btn').click(function() {
            
//             var le = $('<li></li>').html('<input type="text"><button>X</button>');
//             le.find('button').click(function(ev) {
//                 $(ev.target).parent().remove();
//             });
//             le.find('input').keypress(function(ev) {
//                 if (ev.key === "Enter")
//                     closeInfoBox();
//             });
//             back.find('ul').append(le);
//         });

//         back.find('#ok-btn').click(function() {
//             event.stopPropagation();
//             console.log("In")
//             closeInfoBox();
//         });

//         function closeInfoBox() {
//             updateFn(jthis);
//             back.hide();
//             front.show();
//             open = false;
//         }

//         // function update() {
//         //     var htmlStr = '';
//         //     back.find('input').each(function() {
//         //         htmlStr += '<li>'
//         //                 + $(this).val()
//         //                 +  '</li>';
//         //     });
//         //     front.find('ul').html(htmlStr);
//         // }
//     }
// }


// /* Regular Listing Info Boxes! */

// function listsUpdate(jthis) {
//     var htmlStr = '';
//     var front = $(jthis).find('.front-section');
//     var back = $(jthis).find('.back-section');
//     back.find('input').each(function() {
//         htmlStr += '<li>'
//                 + $(this).val()
//                 +  '</li>';
//     });
//     front.find('ul').html(htmlStr);
// }
// $('.info-box').each(prepareInfoBox(listsUpdate));

// /* State Info Box! */

// function stateUpdate(jthis) {
//     var htmlStr = '';
//     var front = $(jthis).find('.front-section');
//     var back = $(jthis).find('.back-section');
//     htmlStr = back.find('select').val();
//     front.find('h3').text(htmlStr);
// }
// $('.state-box').each(prepareInfoBox(stateUpdate));


// $('.info-box').each(function() {
//     var open = false;
//     var title = $(this).find('h3');
//     var front = $(this).find('.front-section');
//     var back = $(this).find('.back-section');
//     back.hide();

//     $(this).click(function() {
//         if (open) return;
//         console.log("Out")
//         back.show();
//         front.hide();
//     });

//     back.find('#add-btn').click(function() {
        
//         var le = $('<li></li>').html('<input type="text"><button>X</button>');
//         le.find('button').click(function(ev) {
//             $(ev.target).parent().remove();
//         });
//         le.find('input').keypress(function(ev) {
//             if (ev.key === "Enter")
//                 closeInfoBox();
//         });
//         back.find('ul').append(le);
//     });

//     back.find('#ok-btn').click(function() {
//         event.stopPropagation();
//         console.log("In")
//         closeInfoBox();
//     });

//     function closeInfoBox() {
//         update();
//         back.hide();
//         front.show();
//         open = false;
//     }

//     function update() {
//         var htmlStr = '';
//         back.find('input').each(function() {
//             htmlStr += '<li>'
//                        + $(this).val()
//                     +  '</li>';
//         });
//         front.find('ul').html(htmlStr);
//     }
// });

/* State Boxes */


// Speaker List Search Box 
// onWarningsSearchResults()
// function onWarnSR(result) {
//     console.log('Warning to....');
//     console.log(result);
// }
// prepareCountrySearcher('#w-country-searcher', onWarnSR);





const { ipcRenderer } = require('electron');

const storage  = require('../../storage');
const Language = require('../../languages');
const language = new Language(__dirname);

const components = require('./components');
const ImageFlagComponent = require('../common/components/imageflag');
const TimerComponent     = require('../common/components/timer');
const SpeakerListComponent = components.SpeakerListComponent;
const TitleComponent = require('../common/components/title');
const MultiLabelInfoComponent = require('../common/components/info').MultiLabelInfoComponent;

let backBtn, imageFlagCont, timerCont, speakerListCont, titleCont, topicsCont, chairsCont, stateCont, warningsCont;

function init () {

    const UN_FLAG_IMG_PATH = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/2000px-Flag_of_the_United_Nations.svg.png';

    let sId = storage.getObj('session-active', -1);
    let delegates = storage.getObj('delegates-activated', []);
    let unsession = storage.getObj('s-'+sId+'-data', {});
    let meta      = storage.getObj('s-'+sId, {});


    // Speaker List and Timer
    imageFlagCont = new ImageFlagComponent('#flagImg-component', language, UN_FLAG_IMG_PATH, unsession.imgFlagPath)
    timerCont = new TimerComponent('#timer-component', language, unsession.defaultTime);
    speakerListCont = new SpeakerListComponent('#speakerList-component', language, delegates, unsession.savedSpeakers);

    // Info
    titleCont  = new TitleComponent('#title-component', language, meta.name);
    topicsCont = new MultiLabelInfoComponent('#topics-component', language, unsession.topics);
    chairsCont = new MultiLabelInfoComponent('#chairs-component', language, unsession.chairs);
    // stateCont  = new StateInfoComponent('sessionState-component', language, unsession.state);

    // Warnings
    // warningsCont = new WarningsComponent('warnings-component', language, delegates, unsession.warnings);

    timerCont.onDefaultTimeChanged((newDefTime) => {
        unsession.defaultTime = newDefTime;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    speakerListCont.onCurrentSpeakerChanged((delegate) => {
        if (delegate) {
            unsession.imgFlagPath = delegate.path;
        } else {
            unsession.imgFlagPath = UN_FLAG_IMG_PATH;
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

    // stateCont.onInfoChange((newInfo) => {
    //     unsession.state = newInfo;
    //     storage.setObj('s-'+sId+'-data', unsession);
    // });

    // warningsCont.onInfoChange((newInfo) => {
    //     unsession.warnings = newInfo;
    //     storage.setObj('s-'+sId+'-data', unsession);
    // });   

    let backBtn = document.getElementById('back-btn');
    backBtn.addEventListener('click', () => {
        ipcRenderer.send('goto-view', 'menu');
    });
}