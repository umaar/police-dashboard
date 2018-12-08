import data from './london-wards-2014.js';
import pubsub from './pubsub.js';

function createMap() {
	console.log({data});

	const londonLongLat = [51.509865, -0.118092];
	const map = L.map('map').setView(londonLongLat, 10);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: '',
		id: 'mapbox.light'
	}).addTo(map);

	function onEachFeature(feature, layer) {
		const {
		  ward,
		  gss_code_ward,
		  gss_code_borough,
		  borough
		} = feature.properties;

		const popupContent = `
			<ul>
				<li><strong>ward:</strong> ${ward}</li>
				<li><strong>gss_code_ward:</strong> ${gss_code_ward}</li>
				<li><strong>gss_code_borough:</strong> ${gss_code_borough}</li>
				<li><strong>borough:</strong> ${borough}</li>
			</ul>
		`;

		layer.bindPopup(popupContent);
		layer.on('popupopen', () => {
			pubsub.publish('area:click', {
				borough
			});
		});
	}

	L.geoJSON([data], {
		style(feature) {
			return feature.properties && feature.properties.style;
		},

		onEachFeature,

		pointToLayer(feature, latlng) {
			return L.circleMarker(latlng, {
				radius: 8,
				fillColor: '#ff7800',
				color: '#000',
				weight: 1,
				opacity: 1,
				fillOpacity: 0.8
			});
		}
	}).addTo(map);
}

function init() {
	createMap();
}

export default {
	init
};
