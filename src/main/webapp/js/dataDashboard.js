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

const columns = [
	{ label: 'ID', field: 'id' },
	{ label: 'FEINumber', field: 'feinumber' },
	{ label: 'LegalName', field: 'legalname' },
	{ label: 'City', field: 'city' },
	{ label: 'CountryName', field: 'countryname' },
	{ label: 'InspectionID', field: 'inspectionid' },
	{ label: 'InspectionEndDate', field: 'inspectionenddate' },
	{ label: 'FiscalYear', field: 'fiscalyear' },
	{ label: 'PostedCitations', field: 'postedcitations' },
	{ label: 'ClassificationCode', field: 'classificationcode' },
	{ label: 'ProjectArea', field: 'projectarea' },
	{ label: 'ProductType', field: 'producttype' },
	{ label: 'AdditionalDetails', field: 'additionaldetails' },
	{ label: 'FirmProfile', field: 'firmprofile' },
];
const asyncTable_inspections_classifications = new datatable(
	document.getElementById('inspections-classifications-table'),
	{ columns, },
	{ loading: true }
);
function loadFdaInspectionsClassifications() {
	var url = '/fdatracker/api/fda_inspections_classifications';
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			return response.json();

		})
		.then((response) => {
						console.log(response)

			asyncTable_inspections_classifications.update(
				{
					rows: response.map((user) => ({
						...user,
						id: user.id,
						feinumber: user.feinumber,
						/*legalname: user.legalname,
						city: user.city,
						countryname: user.countryname,
						inspectionid: user.inspectionid,
						inspectionenddate: user.inspectionenddate,
						fiscalyear: user.fiscalyear,
						postedcitations: user.postedcitations,
						classificationcode: user.classificationcode,
						projectarea: user.projectarea,
						producttype: user.producttype,
						additionaldetails: user.additionaldetails,
						firmprofile: user.firmprofile,*/
					})),
				},
				{ loading: false }
			);
		});

}
loadFdaInspectionsClassifications();
