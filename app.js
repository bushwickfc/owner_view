var ownerTable = $('table')[0];

// We can assume that all of the rows of data will have the same keys -
// so grab a sample row and pull the keys off to be used in the table header and as a reference for the other rows.
var makeRowMap = function(sampleRow) {
	return Object.keys(sampleRow);
};

var makeHeaderRow = function(rowMap) {
	var headerRow = document.createElement('tr');

	for (var i = 0; i < rowMap.length; i++) {
		var tableHeader = document.createElement('th');
		tableHeader.innerHTML = rowMap[i];
		headerRow.append(tableHeader);
	};

	return ownerTable.append(headerRow);
};

var makeTableRow = function(rowMap, ownerData) {
	for (var i = 0; i < ownerData.length; i++) {
		var tableRow = document.createElement('tr');

		for (var j = 0; j < rowMap.length; j++) {
			var tableCell = document.createElement('td');
			tableCell.innerHTML = ownerData[i][rowMap[j]];
			tableRow.append(tableCell);
		};

		ownerTable.append(tableRow);
	};

	return undefined;
};

var makeRows = function(ownerData) {
	var rowMap = makeRowMap(ownerData[0]);
	makeHeaderRow(rowMap, ownerData);
	makeTableRow(rowMap, ownerData);
	return undefined;
};

var fetchOwnerData = function(callback) {
	$.post('./get_all_owners.php', {}, function(ownerData) {
		if (ownerData.length === 0) {
			return [];
		}

		return callback(JSON.parse(ownerData));
	});
};

$(document).ready(function() {
	return fetchOwnerData(makeRows);
});
