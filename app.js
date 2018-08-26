var ownerTable = $('table')[0];

// We can assume that all of the rows of data will have the same keys -
// so grab a sample row and pull the keys off to be used in the table header and as a reference for the other rows.
var makeRowMap = function(sampleRow) {
	return Object.keys(sampleRow);
};

// Populate either kind of row - either header or just 'normal' data.
var populateRow = function(cellType, rowMap, owner) {
	var tableRow = document.createElement('tr');

	for (var i = 0; i < rowMap.length; i++) {
		var tableCell = document.createElement(cellType);
		tableCell.innerHTML = owner ? owner[rowMap[i]] : rowMap[i];
		tableRow.append(tableCell);
	};

	return tableRow;
};

var appendHeaderRow = function(rowMap) {
	var headerRow = populateRow('th', rowMap);
	ownerTable.append(headerRow);
};

var appendTableRows = function(rowMap, ownerData) {
	for (var i = 0; i < ownerData.length; i++) {
		var dataRow = populateRow('td', rowMap, ownerData[i])
		ownerTable.append(dataRow);
	};
};

// Populate the rows and append them to the table in the DOM.
// Passed as a callback to fetchOwnerData().
var makeRows = function(ownerData) {
	var rowMap = makeRowMap(ownerData[0]);
	appendHeaderRow(rowMap);
	appendTableRows(rowMap, ownerData);
};

var fetchOwnerData = function(callback) {
	$.post('./get_all_owners.php', {}, function(ownerData) {
		if (ownerData.length > 0) {
			return callback(JSON.parse(ownerData));
		}
	});
};

$(document).ready(function() {
	return fetchOwnerData(makeRows);
});
