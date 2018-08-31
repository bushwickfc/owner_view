var ownerTable = $('table')[0];

// Remove underscores and capitalize the first letter of each word.
function prettifyField(field) {
	field = field.replace(/_/g, ' ');
	return field.replace(/\w\S*/g, function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
};

// Populate either kind of row - either header or just 'normal' data.
var populateRow = function(cellType, rowKeys, owner) {
	var tableRow = document.createElement('tr');

	for (var i = 0; i < rowKeys.length; i++) {
		var tableCell = document.createElement(cellType);
		tableCell.innerHTML = owner ? owner[rowKeys[i]] : prettifyField(rowKeys[i]);

		if (cellType === 'th') {
			// This code may seem a bit unusual - it results in an HTML element with seemingly duplicate data:
			// <th>Text<div>Text</div></th>
			// but this is some necessary trickery in order to get the scrolling table to look right.
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

var makeHeader = function(rowKeys) {
	var tableHead = document.createElement('thead');
	var headerRow = populateRow('th', rowKeys);

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

// We can assume that all of the rows of data will have the same keys -
// so grab a sample row and pull the keys off to be used in the table header and as a reference for the other rows.
var makeRowKeys = function(sampleRow) {
	return Object.keys(sampleRow);
};

// Populate the rows and append them to the table in the DOM.
// Passed as a callback to fetchOwnerData().
var makeTableContent = function(ownerData) {
	var rowKeys = makeRowKeys(ownerData[0]);

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

// In order to create the custom styling needed to make the table scrollable with a fixed header
// and still look good, need to set the .wrapper width based on the calculated width of its child, .container.
var setCustomCSS = function() {
	var container = document.getElementsByClassName('container')[0];
	var containerWidth = window.getComputedStyle(container, null)['width'];
	var wrapper = document.getElementsByClassName('wrapper')[0];
	wrapper.style.width = containerWidth;
};

var makeTable = function(tableContent) {
	ownerTable.append(tableContent.tableHeader);
	ownerTable.append(tableContent.tableBody);
	setCustomCSS();
};

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
