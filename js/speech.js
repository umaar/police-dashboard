import pubsub from './pubsub.js';

function speak({text}) {
	const synth = window.speechSynthesis;
	const utterThis = new SpeechSynthesisUtterance(text);
	synth.speak(utterThis);
}

function triggerSpeech() {
	console.log('Triggering speech!');
	const recognition = new window.webkitSpeechRecognition();
	recognition.onresult = (event) => {
		const speechToText = event.results[0][0].transcript;
		console.log('Got a result!', speechToText);

		pubsub.publish('speech:query:result', {
			text: speechToText
		});
	}
	recognition.start();
}

function triggerSpeechMock() {
	setTimeout(() => {
		pubsub.publish('speech:query:result', {
			text: 'who is the victim'
		});
	}, 400);
}

function init() {
	// pubsub.subscribe('speech:query:start', triggerSpeech);
	pubsub.subscribe('speech:query:start', triggerSpeech);
	pubsub.subscribe('speech:speak', speak);
}

export default {
	init
};