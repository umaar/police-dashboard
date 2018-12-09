import pubsub from './pubsub.js';
import api from './api.js';

async function onAreaSelection({borough}) {
	const response = await api.watsonComplete({borough});

	if (!response) return;
	console.log({response});
	const keywords = response.results[0].enriched_text.keywords;

	if (!keywords.length) return;

	const keywordsText = keywords
		.slice(0, 5)
		.map(({text}) => text)
		.map(text => text.toLowerCase());

	const summaryText = `${response.passages[0].passage_text} <br /><br /> ${response.passages[1].passage_text}
	`;

	const template = `
	<div class="row">

		<div class="col-md-7 col-xl-4">
			<div class="card">
				<div class="card-header">
					<h3 class="card-title">You've selected ${borough}</h3>
				</div>
				<div class="card-body cris-main-body">
					<h3>Summary</h3>
					<p>${summaryText}</p>
				</div>

				<div class="card-footer">
					<strong>Tags: </strong>
					${keywordsText.map(text => `<span class="cris-tags">${text}</span>`).join(', ')}
				</div>
			</div>
		</div>

		<div class="card col-md-5">
		  <div class="card-header">
		    <h3 class="card-title">Ask a question</h3>
		    <div class="card-options">
		        <a href="#" class="btn btn-primary btn-sm ask-query">Ask</a>
		    </div>
		  </div>
		  <div class="card-body ask-query-result">
		    Your response will appear here
		  </div>
		  <div class="card-footer">
		    <strong>Example: </strong> <em>Who is the victim?</em>
		  </div>
		</div>
	</div>
	`;

	const templateContainer = document.querySelector('#area-selection');

	templateContainer.innerHTML = template;

	const peopleResponse = await api.watsonPeople();

	const people = peopleResponse
		.aggregations[0]
		.aggregations[0]
		.aggregations[0]
		.results.map(({key}) => key)
		.map(name => `<li>${name}</li>`)
		.join(' ')

	document.querySelector('.cris-main-body').innerHTML += `
		<br />
		<h3>
			People Involved
		</h3>

		<ul>
			${people}
		</ul>
	`;

	const evidenceResponse = await api.watsonEvidence();

	const evidenceText = evidenceResponse.passages[0].passage_text

	document.querySelector('.cris-main-body').innerHTML += `
		<br />
		<h3>
			Evidence
		</h3>

		<p>
			${evidenceText}
		</p>
	`;


	const incidentTypeResponse = await api.watsonIncidentType();
	const incidentType = incidentTypeResponse.aggregations[0].aggregations[0].aggregations[0].results[0].key;

	document.querySelector('.cris-main-body').innerHTML += `
		<br />
		<h3>
			Incident Type
		</h3>

		<p>
			${incidentType}
		</p>
	`;


	setTimeout(() => {
		window.scrollTo({
			top: 1000,
			behavior: 'smooth'
		});
	}, 16);
}

function init() {
	pubsub.subscribe('area:click', onAreaSelection);
}

export default {init};