
var fetchOwnerData = function() {
	$.post('./get_all_owners.php', {}, function(data) {
		console.log(JSON.parse(data))
	});
};

$(document).ready(function() {
	return fetchOwnerData()
});
