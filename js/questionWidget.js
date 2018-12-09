import pubsub from './pubsub.js';
import api from './api.js';

async function handleSpeechResult({text}) {
	console.log('Got a speech result!', text);
	const resultContainer = document.querySelector('.ask-query-result');

	resultContainer.innerHTML = `
		<p><strong>You asked</strong>
			<em>${text}</em>
		</p>
	`;

	const response = await api.watsonQuestion({question: text});
	const answer = response.passages[0].passage_text;
	console.log('The watson question response is: ', response);

	const textToDisplay = `
		<p>
			<strong>Answer: </strong>
			${answer}
		</p>
	`;

	resultContainer.innerHTML += textToDisplay;


	pubsub.publish('speech:speak', {
		text: answer
	});
}

function init() {
	document.body.addEventListener('click', (e) => {
		if (e.target.matches('.ask-query')) {
			e.preventDefault();
			console.log('Ask query click');
			pubsub.publish('speech:query:start', {
				foo: 'bar'
			});
		}

		return;
	});

	pubsub.subscribe('speech:query:result', handleSpeechResult);
}

export default {
	init
};