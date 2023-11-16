// Graph
var ctx = document.getElementById("myChart");
const sidenav = document.getElementById("main-sidenav");
const sidenavInstance = mdb.Sidenav.getInstance(sidenav);

let innerWidth = null;

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

fetch('api/fda_warning_letter_1')
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
		var myChart = new Chart(ctx, {
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
		});
	});



fetch('api/fda_warning_letter_company')
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return response.json();
	})
	.then((response) => {
		var labels = [];
		var data = [];
		response.forEach(function(i,k){labels.push(i.company_name); data.push(i.count);})
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

		new mdb.Chart(
			document.getElementById('myChart2'),
			dataChartOptionsExample,
			optionsChartOptionsExample
		);
	});

