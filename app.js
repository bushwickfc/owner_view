var ownerTable = $('table')[0];
// The fields from the database, in the order that we want to display them.
var fields = [
	'owner_type_name',
	'first_name',
	'last_name',
	'email',
	'pos_display',
	'hour_balance',
	'equity_paid',
	'equity_due',
	'equity_delinquent',
	'equity_current',
	'hours_current',
	'owner_price',
	'equity_to_be_paid',
	'plan_join_date',
];
// Each rowKey has the field name and a prettified version of that name.
// These keys are used to populate the header (using displayName) and the body
// rows (grabbing the values out of each data row via the fieldName).
var rowKeys = fields.map(function(field) {
	return {
		displayName: prettifyField(field),
		fieldName: field,
	}
});

// Remove underscores and capitalize the first letter of each word.
// Since we're changing owner_type_name into Owner Type, just manually set that one.
function prettifyField(field) {
	if (field === 'owner_type_name') {
		return 'Owner Type';
	}

	field = field.replace(/_/g, ' ');
	return field.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

// Populate either kind of row - either header or just 'normal' data.
var populateRow = function(cellType, keys, owner) {
	var tableRow = document.createElement('tr');

	for (var i = 0; i < keys.length; i++) {
		var tableCell = document.createElement(cellType);
		tableCell.innerHTML = owner ? owner[keys[i].fieldName] : keys[i].displayName;

		if (cellType === 'th') {
			var tableCellDiv = document.createElement('div');
			tableCellDiv.innerHTML = tableCell.innerHTML;
			tableCell.append(tableCellDiv);
			tableRow.append(tableCell);
		} else {
			tableRow.append(tableCell);
		};
	};

	return tableRow;
};

var makeHeader = function(keys) {
	var tableHead = document.createElement('thead');
	var headerRow = populateRow('th', keys);

	tableHead.append(headerRow);

	return tableHead;
};

var makeBody = function(rowKeys, ownerData) {
	var tableBody = document.createElement('tbody');

	for (var i = 0; i < ownerData.length; i++) {
		var dataRow = populateRow('td', rowKeys, ownerData[i])
		tableBody.append(dataRow);
	};

	return tableBody;
};

// Populate the rows and append them to the table in the DOM.
// Passed as a callback to fetchOwnerData().
var makeTableContent = function(ownerData) {
	return {
		tableHeader: makeHeader(rowKeys),
		tableBody: makeBody(rowKeys, ownerData),
	}
};

// Sort the owners by last name.
// Note that, for the purposes of evaluating alphabetical position, last names will be lowercased.
var sortByLastName = function(a, b) {
	if (a.last_name.toLowerCase() < b.last_name.toLowerCase()) {
		return -1;
	} else if (a.last_name > b.last_name) {
		return 1;
	}

	return 0;
};

var makeTable = function(tableContent) {
	ownerTable.append(tableContent.tableHeader)
	ownerTable.append(tableContent.tableBody)
}

var fetchOwnerData = function(callback) {
	$.post('./get_all_owners.php', {}, function(ownerData) {
		if (ownerData.length > 0) {
			var sortedOwnerData = JSON.parse(ownerData).sort(sortByLastName);
			var tableContent = makeTableContent(sortedOwnerData);
			return callback(tableContent);
		}
	});
};

$(document).ready(function() {
	return fetchOwnerData(makeTable);
});
