import pubsub from './pubsub.js';
import api from './api.js';

async function onAreaSelection({borough}) {
	const response = await api.watson({borough});

	if (!response) return;

	const keywords = response.results[0].enriched_text.keywords;

	if (!keywords.length) return;

	const keywordsText = keywords
		.slice(0, 5)
		.map(({text}) => text)
		.map(text => text.toLowerCase());

	console.log({response});

	const template = `
		<section>
			<h3>
				You've selected ${borough}
			</h3>

			<p class="cris-tags">
				${keywordsText.map(text => `<span>${text}</span>`).join(', ')}
			</p>
		</section>
	`;

	const templateContainer = document.querySelector('#area-selection');

	templateContainer.innerHTML = template;
}

function init() {
	pubsub.subscribe('area:click', onAreaSelection);
}

export default {init};