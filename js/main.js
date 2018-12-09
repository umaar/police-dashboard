import map from './map.js';
import areaSelection from './areaSelection.js';
import questionWidget from './questionWidget.js';
import speech from './speech.js';

function start() {
	map.init();
	areaSelection.init();
	questionWidget.init();
	speech.init();
}

start();
