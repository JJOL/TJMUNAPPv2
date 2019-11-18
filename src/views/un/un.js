/* Interface Globals */
// var participants = [
//     {
//         formalName: 'México',
//         name: 'Mexico',
//         imageFileName: 'mexico.jpg',
//         imageName: 'Mexico\'s Flag',
//         id: 0
//     },
//     {
//         formalName: 'Belgium',
//         name: 'Belgium',
//         imageFileName: 'belgium.jpg',
//         imageName: 'Belgium\'s Flag',
//         id: 1
//     },
//     {
//         formalName: 'Camerun',
//         name: 'Camerun',
//         imageFileName: 'camerun.jpg',
//         imageName: 'Camerun\'s Flag',
//         id: 2
//     },
//     {
//         formalName: 'Costa Rica',
//         name: 'Costa Rica',
//         imageFileName: 'costa_rica.jpg',
//         imageName: 'Costa Rica\'s Flag',
//         id: 3
//     },
//     {
//         formalName: 'Gina',
//         name: 'Gina',
//         imageFileName: 'gina.jpg',
//         imageName: 'Gina\'s Flag',
//         id: 4
//     },
//     {
//         formalName: 'Luxemburgo',
//         name: 'Luxemburgo',
//         imageFileName: 'luxemburgo.jpg',
//         imageName: 'Luxemburgo\'s Flag',
//         id: 5
//     },
//     {
//         formalName: 'Belize',
//         name: 'Belize',
//         imageFileName: 'belize.jpg',
//         imageName: 'Belize\'s Flag',
//         id: 6
//     },
// ];


// /* TIMER */


// let currHrs, currMins;
// let going = false;
// $('#time-set-btn').click(applyDefTime);
// $('#time-ctl-btn').click(function() {
//     going = !going;

//     if (going) {
//         $('#time-ctl-btn').text('Stop');
//         startTimer();
//     } else {
//         $('#time-ctl-btn').text('Start');
//         stopTimer();
//     }
// });

// // Default Set Controls And Listeneres
// var defHrs = 10, defMins = 0;
// setDefTime(defHrs, defMins);
// applyDefTime();

// $('#def-time').click(openClockSet)
// $('#timer #in-check').click(closeClockSet)
// $('#hr-in').keypress(function(ev) {
//     if (ev.key == 'Enter') closeClockSet();
// });
// $('#min-in').keypress(function(ev) {
//     if (ev.key == 'Enter') closeClockSet();
// });

// // Default Time Functions
// function openClockSet() {

//     $('#hr-in').val(defHrs);
//     $('#min-in').val(defMins);

//     $('#hr-in').toggleClass('active');
//     $('#min-in').toggleClass('active');
//     $('#in-check').toggleClass('active');
//     $('#def-time').hide();
// }

// function closeClockSet() {

//     defHrs = Number($('#hr-in').val());
//     defMins = Number($('#min-in').val());
//     setDefTime(defHrs, defMins);

//     $('#hr-in').toggleClass('active');
//     $('#min-in').toggleClass('active');
//     $('#in-check').toggleClass('active');
//     $('#def-time').show();
// }

// function setDefTime(hrs, mins) {
//     hrs = timeStr(hrs);
//     mins = timeStr(mins);
//     $('#def-time').text('Default: ' + hrs + ':' + mins);
// }

// // Main Time Functions
// function applyDefTime() {
//     currHrs = defHrs;
//     currMins = defMins;
//     setCurrTime(currHrs, currMins);
// }

// function setCurrTime(hrs, mins) {
//     hrs = timeStr(hrs);
//     mins = timeStr(mins);
//     $('#time-lbl').text('' + hrs + ':' + mins + 's');
// }

// function startTimer() {
//     clockId = setInterval(function() {
        
//         if (currHrs == 0 && currMins == 0) {
//             // End Of Timer!!
//             stopTimer();
//             return;
//         }

//         if (currMins > 0) 
//             currMins--;
//         else {
//             currHrs--;
//             currMins = 59;
//         }

//         if (currHrs == 0 && currMins == 0) {
//             // End Of Timer!!
//             $('#time-ctl-btn').text('Start');
//             stopTimer();
//             onTimerEnd();
//         }


//         setCurrTime(currHrs, currMins);
//     }, 1000);
// }

// function stopTimer() {
//     clearInterval(clockId);
// }

// function onTimerEnd() {
//     nextSpeakerList();
//     applyDefTime();
//     startTimer();
// }

// // Utils
// function timeStr(num) {
//     var str = '' + num;
//     for (var i = str.length; i < 2; i++)
//         str = '0' + str;
//     return str;
// }



// /* SPEAKER LIST*/
// var speakerArr = [];
// displaySpeakerList(speakerArr);

// function displaySpeakerList(speakerArr) {
//     var lHtmlStr = '';
//     for (var i=0; i < speakerArr.length; i++) {
//         var speaker = speakerArr[i];
//         lHtmlStr += '<div class="row"><div class="col'+(speaker.currentSpeaker ? ' curr-speaker' : '')+'">' 
//                   + speakerArr[i].name
//                   + '<button onclick="removeById('+i+')">X</button></div></div>';
//     }

//     $('#speaker-list').html(lHtmlStr);
// }

// // Interface Functions with Timer and Box Search
// function addSpeakerList(speakerName) {
//     speakerArr.push({ name: speakerName });

//     if (speakerArr.length == 1)
//         speakerArr[0].currentSpeaker = true;

//     displaySpeakerList(speakerArr);
// }

// function clearSpeakerList() {
//     speakerArr = [];
//     displaySpeakerList(speakerArr);
// }

// function nextSpeakerList() {
//     forwardCurrent(speakerArr);
// }

// // Own Interface
// function resetCurrent() {
//     // Clear Current Speaker
//     for (var i = 0; i < speakerArr.length; i++) {
//         speakerArr[i].currentSpeaker = false;
//     }
//     // Set First Speaker as Current Speaker
//     if (speakerArr.length > 0) {
//         speakerArr[0].currentSpeaker = true;
//     }
//     displaySpeakerList(speakerArr);
// }
// function forwardCurrent() {
//     for (var i = 0; i < speakerArr.length; i++) {
//         if (speakerArr[i].currentSpeaker) {
//             speakerArr[i].currentSpeaker = false;
//             if (i < speakerArr.length-1)
//                 speakerArr[i+1].currentSpeaker = true;

//             break;
//         }
//     }
//     displaySpeakerList(speakerArr);
// }
// function backwardCurrent() {
//     for (var i = 0; i < speakerArr.length; i++) {
//         if (speakerArr[i].currentSpeaker) {
//             speakerArr[i].currentSpeaker = false;
//             if (i > 0)
//                 speakerArr[i-1].currentSpeaker = true;

//             break;
//         }
//     }
//     displaySpeakerList(speakerArr);
// }

// function removeByName(name) {
//     for (var i=0; i < speakerArr.length; i++) {
//         if (speakerArr[i].name == name) {
//             removeById(i);
//             break;
//         }
//     }
// }

// function removeById(id) {
//     if (id < 0 || id >= speakerArr.length) {
//         console.log('Error: SpeakerList::removeById(id) called with invalid id! {'+id+'}');
//         return;
//     }
//     if (speakerArr[id].currentSpeaker) {
//         forwardCurrent();
//     }
//     speakerArr.splice(id, 1); // Remove
//     displaySpeakerList(speakerArr);
// }



/* SEARCH BOX */
/*
var searchCont = $('#country-searcher');
var searchIn = searchCont.find('#search-in');
var searchList = searchCont.find('#search-list');

var optionList = ['Belgium', 'Belize', 'Bogota', 'Buenos Aires', 'Camerun', 'Cancun', 'Costa Rica', 'Gina', 'Genebre', 'Luxemburgo', 'Mexico', 'Nicaragua', 'Norwai'];

searchIn.on('input', processInput);

function processInput() {
    var pattern = searchIn.val().toLowerCase();
    var results = [];

    for (var i = 0; i < optionList.length; i++) {
        if (optionList[i].toLocaleLowerCase().indexOf(pattern) !== -1) {
            results.push(optionList[i]);
        }
    }

    results = results.sort();

    displayResults(results);
}

function displayResults(results) {
    var htmlStr = '';
    for (var i=0; i < results.length; i++) {
        htmlStr += '<li onclick="onResultSelected(\''+results[i]+'\')">'
                 +   results[i]
                 + '</li>';
    }
    searchList.html(htmlStr);
}
*/

/**
 * function matchingResults(pattern, list)
 * Search the string @pattern within the @list elements ignoring
 * case sensitivity.
 */
// function matchingResults(pattern, list) {
//     var results = [];
//     pattern = pattern.toLocaleLowerCase();

//     for (var i=0; i < list.length; i++) {
//         if (list[i].toLocaleLowerCase().indexOf(pattern) !== -1) {
//             results.push(list[i]);
//         }
//     }
//     results = results.sort();

//     return results;
// }

// function prepareCountrySearcher(el, onSelectFn) {
//     var searchCont = $(el);
//     var searchIn = searchCont.find('#search-in');
//     var searchList = searchCont.find('#search-list');
    
//     var optionList = ['Belgium', 'Belize', 'Bogota', 'Buenos Aires', 'Camerun', 'Cancun', 'Costa Rica', 'Gina', 'Genebre', 'Luxemburgo', 'Mexico', 'Nicaragua', 'Norwai'];
    
//     searchIn.on('input', processInput);


//     function processInput() {
        
//         results = matchingResults(searchIn.val(), optionList);
//         ma
//         clearResults();
//         displayResults(results);
//     }

//     function clearResults() {
//         searchList.empty();
//     }
//     function displayResults(results) {
        
//         for (var i=0; i < results.length; i++) {
//             resEl = $('<li></li>').text(results[i]);
//             resEl.click(clickHandlerFor(results[i]));
//             searchList.append(resEl);
//         }
//     }

//     function clickHandlerFor(res) {
//         return function() {
//             onSelectFn(res);
//         };
//     }
// }

// // Speaker List Search Box 
// // onSpeakerListSearchResults()
// function onSpeakerSR(result) {
//     addSpeakerList(result);
// }
// prepareCountrySearcher('#s-country-searcher', onSpeakerSR);



// /* Front-Back Elements */



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


// // $('.info-box').each(function() {
// //     var open = false;
// //     var title = $(this).find('h3');
// //     var front = $(this).find('.front-section');
// //     var back = $(this).find('.back-section');
// //     back.hide();

// //     $(this).click(function() {
// //         if (open) return;
// //         console.log("Out")
// //         back.show();
// //         front.hide();
// //     });

// //     back.find('#add-btn').click(function() {
        
// //         var le = $('<li></li>').html('<input type="text"><button>X</button>');
// //         le.find('button').click(function(ev) {
// //             $(ev.target).parent().remove();
// //         });
// //         le.find('input').keypress(function(ev) {
// //             if (ev.key === "Enter")
// //                 closeInfoBox();
// //         });
// //         back.find('ul').append(le);
// //     });

// //     back.find('#ok-btn').click(function() {
// //         event.stopPropagation();
// //         console.log("In")
// //         closeInfoBox();
// //     });

// //     function closeInfoBox() {
// //         update();
// //         back.hide();
// //         front.show();
// //         open = false;
// //     }

// //     function update() {
// //         var htmlStr = '';
// //         back.find('input').each(function() {
// //             htmlStr += '<li>'
// //                        + $(this).val()
// //                     +  '</li>';
// //         });
// //         front.find('ul').html(htmlStr);
// //     }
// // });

// /* State Boxes */


// // Speaker List Search Box 
// // onWarningsSearchResults()
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
const ImageFlagComponent = components.ImageFlagComponent;
const TimerComponent     = require('../common/components/timer');
const SpeakerListComponent = components.SpeakerListComponent;
let backBtn, imageFlagCont, timerCont, speakerListCont, titleCont, topicsCont, chairsCont, stateCont, warningsCont;

function init () {

    const UN_FLAG_IMG_PATH = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_the_United_Nations.svg/2000px-Flag_of_the_United_Nations.svg.png';

    let sId = storage.getObj('session-active', -1);
    let delegates = storage.getObj('delegates-activated', []);
    let unsession = storage.getObj('s-'+sId+'-data', {});
    let meta      = storage.getObj('s-'+sId, {});


    // Speaker List and Timer
    imageFlagCont = new ImageFlagComponent('#flagImg-component', UN_FLAG_IMG_PATH, unsession.imgFlagPath)
    timerCont = new TimerComponent('#timer-component', language, unsession.defaultTime);
    speakerListCont = new SpeakerListComponent('#speakerList-component', language, delegates, unsession.savedSpeakers);

    // Info
    // titleCont  = new TitleComponent('title-component', language, meta.name);
    // topicsCont = new MultiLabelInfoComponent('topics-component', language, unsession.topics);
    // chairsCont = new MultiLabelInfoComponent('chairs-component', language, unsession.chairs);
    // stateCont  = new StateInfoComponent('sessionState-component', language, unsession.state);

    // Warnings
    // warningsCont = new WarningsComponent('warnings-component', language, delegates, unsession.warnings);

    timerCont.onDefaultTimeChanged((newDefTime) => {
        unsession.defaultTime = newDefTime;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    speakerListCont.onCurrentSpeakerChanged((delegate) => {
        console.log(delegate);
        
        if (delegate) {
            imageFlagCont.setCurrentImage(delegate.path);
        } else {
            imageFlagCont.setCurrentImage(null);
        }
    });

    speakerListCont.onSpeakerListChanged((speakers) => {
        unsession.savedSpeakers = speakers;
        storage.setObj('s-'+sId+'-data', unsession);
    });

    // topicsCont.onInfoChange((newInfo) => {
    //     unsession.topics = newInfo;
    //     storage.setObj('s-'+sId+'-data', unsession);
    // });

    // chairs.onInfoChange((newInfo) => {
    //     unsession.chairs = newInfo;
    //     storage.setObj('s-'+sId+'-data', unsession);
    // });

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