// Graph
const sidenav = document.getElementById("main-sidenav");
const sidenavInstance = mdb.Sidenav.getInstance(sidenav);
var subjectFilter = 'Foreign Supplier Verification Program (FSVP)';
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
		response.forEach(function(i, k) { html += `<option value="` + k + `" >[`+i.count+`] ` + i.subject + `</option>` });
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
		response.forEach(function(i, k) { html += `<option value="1" >[`+i.count+`] ` + i.issuing_office + `</option>` });
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
