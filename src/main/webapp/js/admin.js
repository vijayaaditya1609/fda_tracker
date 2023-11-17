// Graph
const sidenav = document.getElementById("main-sidenav");
const sidenavInstance = mdb.Sidenav.getInstance(sidenav);
const map = document.getElementById('map-advanced');
const legend = document.getElementById('map-advanced-legend');
const displayBtns = document.getElementsByClassName('map-advanced-display');
const btns = document.getElementsByClassName('btn-map-advanced');

var subjectFilter = undefined;
var subjects = [];
var issuingOfficeFilter;
var issuingOffices = [];
let innerWidth = null;
var barChart, lineChart;
const setMode = (e) => {
	// Check necessary for Android devices
	if (window.innerWidth === innerWidth) {
		return;
	}

	innerWidth = window.innerWidth;

	if (window.innerWidth < 1400) {
		sidenavInstance.changeMode("over");
		sidenavInstance.hide();
	} else {
		sidenavInstance.changeMode("side");
		sidenavInstance.show();
	}
};

setMode();

// Event listeners
window.addEventListener("resize", setMode);

const searchFocus = document.getElementById('search-focus');
const keys = [
	{ keyCode: 'AltLeft', isTriggered: false },
	{ keyCode: 'ControlLeft', isTriggered: false },
];

window.addEventListener('keydown', (e) => {
	keys.forEach((obj) => {
		if (obj.keyCode === e.code) {
			obj.isTriggered = true;
		}
	});

	const shortcutTriggered = keys.filter((obj) => obj.isTriggered).length === keys.length;

	if (shortcutTriggered) {
		searchFocus.focus();
	}
});

window.addEventListener('keyup', (e) => {
	keys.forEach((obj) => {
		if (obj.keyCode === e.code) {
			obj.isTriggered = false;
		}
	});
});

function loadWarningLettersByYearChart() {
	var url = 'api/fda_warning_letter_by_year';
	if (subjectFilter) {
		url = url + "?subject=" + encodeURIComponent(subjectFilter)
	}
	if (issuingOfficeFilter) {
		url = url + "?issuing_office=" + encodeURIComponent(issuingOfficeFilter)
	}
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return response.json();
		})
		.then((response) => {
			var labels = [];
			var values = [];
			response.forEach(function(i, k) { labels.push(i.year); values.push(i.count); })
			var el = document.getElementById("myChart");
			var options = {
				type: "line",
				data: {
					labels: labels,
					datasets: [
						{
							data: values,
							lineTension: 0,
							backgroundColor: "transparent",
							borderColor: "#007bff",
							borderWidth: 4,
							pointBackgroundColor: "#007bff",
						},
					],
				},
				options: {
					maintainAspectRatio: true,
					responsive: true,
					scales: {
						yAxes: [
							{
								ticks: {
									beginAtZero: false,
								},
							},
						],
					},
					legend: {
						display: false,
					},
				},
			};
			if (lineChart) {
				lineChart.destroy()
			}
			lineChart = new Chart(el, options);
		});
}
loadWarningLettersByCompanyChart();
loadWarningLettersByYearChart();
loadCountOfWarningLettersByCountry();

fetch('api/fda_warning_letter_subjects')
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return response.json();
	})
	.then((response) => {
		subjects = response;
		var html = '<option selected value = "-1">Please Select Subject	</option>';
		response.forEach(function(i, k) { html += `<option value="` + k + `" >[` + i.count + `] ` + i.subject + `</option>` });
		document.querySelector('.select-subject').innerHTML = html;
	});
fetch('api/fda_warning_letter_issuing_offices')
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return response.json();
	})
	.then((response) => {
		issuingOffices = response;
		var html = '<option selected value = "-1">Please Select Issuing Office</option>';
		response.forEach(function(i, k) { html += `<option value="1" >[` + i.count + `] ` + i.issuing_office + `</option>` });
		document.querySelector('.select-issuing-office').innerHTML = html;
	});

document.querySelector('.select-subject').addEventListener("change", function() {
	console.log('Subject chnaged');
	if (document.querySelector('.select-subject').value > -1) {
		subjectFilter = subjects[document.querySelector('.select-subject').value].subject;
	} else {
		subjectFilter = undefined;
	}
	loadWarningLettersByYearChart()
	loadWarningLettersByCompanyChart()
	loadCountOfWarningLettersByCountry()
});

document.querySelector('.select-issuing-office').addEventListener("change", function() {
	console.log('Issuing office chnaged');
	if (document.querySelector('.select-issuing-office').value > -1) {
		issuingOfficeFilter = issuingOffices[document.querySelector('.select-issuing-office').value].issuing_office;
	} else {
		issuingOfficeFilter = undefined;
	}
	loadWarningLettersByYearChart()
	loadWarningLettersByCompanyChart()
	loadCountOfWarningLettersByCountry()
});
let COLOR_MAP = null;

let ACTIVE_KEY = 'sales';
let ACTIVE_COLOR = 'green';
var DATA = [];

const COLORS = {
	green: [
		'#C8E6C9',
		'#A5D6A7',
		'#81C784',
		'#66BB6A',
		'#4CAF50',
		'#43A047',
		'#388E3C',
		'#2E7D32',
		'#1B5E20',
	],
	pink: [
		'#F8BBD0',
		'#F48FB1',
		'#F06292',
		'#EC407A',
		'#E91E63',
		'#D81B60',
		'#C2185B',
		'#AD1457',
		'#880E4F',
	],
	blue: [
		'#BBDEFB',
		'#90CAF9',
		'#64B5F6',
		'#42A5F5',
		'#2196F3',
		'#1E88E5',
		'#1976D2',
		'#1565C0',
		'#0D47A1',
	],
	purple: [
		'#E1BEE7',
		'#CE93D8',
		'#BA68C8',
		'#AB47BC',
		'#9C27B0',
		'#8E24AA',
		'#7B1FA2',
		'#6A1B9A',
		'#4A148C',
	],
};

function loadCountOfWarningLettersByCountry() {
	var url = "/fdatracker/api/fda_warning_letter_country";
	if (subjectFilter) {
		url = url + "?subject=" + encodeURIComponent(subjectFilter)
	}
	if (issuingOfficeFilter) {
		url = url + "?issuing_office=" + encodeURIComponent(issuingOfficeFilter)
	}
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return response.json();
		})
		.then((response) => {
			DATA = []
			response.forEach(function(i, k) {
				var country = undefined;
				mapInstance._mapUnits.forEach(
					function(ii, kk) {
						if (ii.title == i.Recipient_Country) {
							country = ii.id; return ii.id;
						}
					});
				if (country)
					DATA.push({ "country": country, "sales": i.count })
				else console.error('Country not found: ' + i.Recipient_Country);
			})
			updateMap();
		});
}
const getColorMap = () => {
	const values = DATA.map((entry) => entry[ACTIVE_KEY]);
	const max = Math.max(...values);
	const min = Math.min(...values);

	var step = Math.floor((max - min) / (COLORS[ACTIVE_COLOR].length - 1));
	if (step == 0)
		step = 1;
	const colorMap = COLORS[ACTIVE_COLOR].map((color, i) => {
		return {
			fill: color,
			regions: [],
		};
	});

	values.forEach((value, i) => {
		let valueLabel = value;
		let val = value
		if (valueLabel < 100) {
			val = Math.min(value * 5, max);
		}
		const color = Math.floor((val - min) / step);
		colorMap[color].regions.push({ id: DATA[i].country, tooltip: valueLabel, ...DATA[i] });
	});

	return colorMap;
};

COLOR_MAP = getColorMap();

var mapInstance = new VectorMap(map, {
	stroke: '#37474F',
	fill: '#263238',
	readonly: true,
	hover: false,
	btnClass: 'btn-light',
	colorMap: COLOR_MAP,
});

const updateMap = () => {
	COLOR_MAP = getColorMap();
	mapInstance.dispose();
	mapInstance = new VectorMap(map, {
		stroke: '#37474F',
		fill: '#263238',
		readonly: true,
		hover: false,
		btnClass: 'btn-light',
		colorMap: COLOR_MAP,
	});
};

const setActiveBtn = (active, btns) => {
	btns.forEach((btn) => {
		if (btn === active) {
			btn.classList.remove('btn-outline-light');
			btn.classList.add('btn-light');
		} else {
			btn.classList.add('btn-outline-light');
			btn.classList.remove('btn-light');
		}
	});
};

btns.forEach((btn) => {
	btn.addEventListener('click', () => {
		ACTIVE_KEY = btn.getAttribute('data-mdb-key');
		ACTIVE_COLOR = btn.getAttribute('data-mdb-color');

		updateMap();

		setActiveBtn(btn, btns);
	});
});

function loadWarningLettersByCompanyChart() {
	var url = 'api/fda_warning_letter_company';
	if (subjectFilter) {
		url = url + "?subject=" + encodeURIComponent(subjectFilter)
	}
	if (issuingOfficeFilter) {
		url = url + "?issuing_office=" + encodeURIComponent(issuingOfficeFilter)
	}
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return response.json();
		})
		.then((response) => {
			var labels = [];
			var data = [];
			response.forEach(function(i, k) { labels.push(i.company_name); data.push(i.count); })
			const dataChartOptionsExample = {
				type: 'bar',
				data: {
					labels: labels,
					datasets: [
						{
							label: 'Top Offendors',
							data: data,
							backgroundColor: [
								'rgba(255, 99, 132, 0.2)',
								'rgba(54, 162, 235, 0.2)',
								'rgba(255, 206, 86, 0.2)',
								'rgba(75, 192, 192, 0.2)',
								'rgba(153, 102, 255, 0.2)',
								'rgba(255, 159, 64, 0.2)',
							],
							borderColor: [
								'rgba(255,99,132,1)',
								'rgba(54, 162, 235, 1)',
								'rgba(255, 206, 86, 1)',
								'rgba(75, 192, 192, 1)',
								'rgba(153, 102, 255, 1)',
								'rgba(255, 159, 64, 1)',
							],
							borderWidth: 1,
						},
					],
				},
			};

			// Options
			const optionsChartOptionsExample = {
				options: {
					maintainAspectRatio: true,
					responsive: true,
					scales: {
						x:
						{
							ticks: {
								color: '#4285F4',
							},
						},
						y:
						{
							ticks: {
								color: '#f44242',
							},
						},
					},
				},
			};
			if (barChart) {
				barChart.destroy();
			}
			barChart = new Chart(
				document.getElementById('myChart2'),
				dataChartOptionsExample,
				optionsChartOptionsExample
			);

		});
}

