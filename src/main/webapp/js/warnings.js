const sidenav = document.getElementById("main-sidenav");
const sidenavInstance = mdb.Sidenav.getInstance(sidenav);

var subjectFilter = new URLSearchParams(window.location.search).get('subject');
var subjects = [];
var issuingOfficeFilter = new URLSearchParams(window.location.search).get('issuing_office');
var issuingOffices = [];
var companyFilter = new URLSearchParams(window.location.search).get('company_name');
var companies = [];

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


const columns = [
	{ label: 'ID', field: 'id' },
	{ label: 'Posted Date', field: 'posted_date' },
	{ label: 'Issue Date', field: 'issue_date' },
	{ label: 'Company Name', field: 'company_name' },
	{ label: 'Letter URL', field: 'letter_url' },
	{ label: 'Issuing Office', field: 'issuing_office' },
	{ label: 'Subject', field: 'subject' },
	{ label: 'Recipient Company', field: 'recipient_country' },
];
const asyncTable = new datatable(
	document.getElementById('warning-table'),
	{ columns, },
	{ loading: true }
);

function loadFdaTrackerWarningLetters() {
	var url = 'api/fda_warning_letters?1=1';
	if (subjectFilter) {
		url = url + "&subject=" + encodeURIComponent(subjectFilter)
	}
	if (issuingOfficeFilter) {
		url = url + "&issuing_office=" + encodeURIComponent(issuingOfficeFilter)
	}
	if (companyFilter) {
		url = url + "&company_name=" + encodeURIComponent(companyFilter)
	}
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return response.json();

		})
		.then((response) => {
			asyncTable.update(
				{
					rows: response.map((user) => ({
						...user,
						id: user.id,
						posted_date: user.posted_date,
						issue_date: user.issue_date,
						company_name: user.company_name,
						letter_url: user.letter_url,
						issuing_office: user.issuing_office,
						subject: user.subject,
						recipient_country: user.recipient_country,
					})),
				},
				{ loading: false }
			);
		});

}
loadFdaTrackerWarningLetters()
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
		response.forEach(function(i, k) {
			if (i.subject === subjectFilter) {
				html += `<option value="` + k + `" selected>[` + i.count + `] ` + i.subject + `</option>`
			} else {
				html += `<option value="` + k + `" >[` + i.count + `] ` + i.subject + `</option>`
			}
		});
		document.querySelector('.select-subject').innerHTML = html;
		new mdb.Select(document.querySelector('.select-subject'))
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
		response.forEach(function(i, k) {
			if (i.issuing_office === issuingOfficeFilter) {
				html += `<option value="` + k + `" selected>[` + i.count + `] ` + i.issuing_office + `</option>`
			} else {
				html += `<option value="` + k + `" >[` + i.count + `] ` + i.issuing_office + `</option>`
			}
		});
		document.querySelector('.select-issuing-office').innerHTML = html;
		new mdb.Select(document.querySelector('.select-issuing-office'));

	});
fetch('api/fda_warning_letter_companies')
	.then((response) => {
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		return response.json();
	})
	.then((response) => {
		companies = response;
		var html = '<option selected value = "-1">Please Select Company</option>';
		response.forEach(function(i, k) {
			if (i.company_name === companyFilter) {
				html += `<option value="` + k + `" selected>[` + i.count + `] ` + i.company_name + `</option>`
			} else {
				html += `<option value="` + k + `" >[` + i.count + `] ` + i.company_name + `</option>`
			}
		});
		document.querySelector('.select-company').innerHTML = html;
		new mdb.Select(document.querySelector('.select-company'));
	});

document.querySelector('.select-subject').addEventListener("change", function() {
	console.log('Subject chnaged');
	if (document.querySelector('.select-subject').value > -1) {
		subjectFilter = subjects[document.querySelector('.select-subject').value].subject;
	} else {
		subjectFilter = undefined;
	}
	updateUrl();
	loadFdaTrackerWarningLetters()
});

document.querySelector('.select-issuing-office').addEventListener("change", function() {
	console.log('Issuing office chnaged');
	if (document.querySelector('.select-issuing-office').value > -1) {
		issuingOfficeFilter = issuingOffices[document.querySelector('.select-issuing-office').value].issuing_office;
	} else {
		issuingOfficeFilter = undefined;
	}
	updateUrl();
	loadFdaTrackerWarningLetters()
});
document.querySelector('.select-company').addEventListener("change", function() {
	console.log('Company chnaged');
	if (document.querySelector('.select-company').value > -1) {
		companyFilter = companies[document.querySelector('.select-company').value].company_name;
	} else {
		companyFilter = undefined;
	}
	updateUrl();
	loadFdaTrackerWarningLetters()
});
function updateUrl() {
	const url = new URL(location);
	if (subjectFilter) url.searchParams.set("subject", subjectFilter);
	if (issuingOfficeFilter) url.searchParams.set("issuing_office", issuingOfficeFilter);
	if (companyFilter) url.searchParams.set("company_name", companyFilter);
	history.pushState({}, "", url);
}
