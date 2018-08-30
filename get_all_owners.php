<?php
include "credentials.php";

function connect($host, $dbname, $user, $password) {
	$conn = pg_connect("host=$host dbname=$dbname user=$user password=$password");

	if ($conn) {
		return($conn);
	} else {
		// Not sure to what extent this is useful, right now...
        trigger_error("Database connection error.");
	}
};

function get_owner_data($conn) {
	$results = pg_query($conn, "SELECT ov.*, oet.equity_type FROM owner_view AS ov
								LEFT JOIN owner_equity_type AS oet
								ON ov.email=oet.email");

	return($results);
};

# pg_fetch_all will retun the results as a list of objects, which can then be JSON-encoded and passed to the client.
function convert_to_list($raw_data) {
	return(pg_fetch_all($raw_data));
};

$conn = connect($host, $dbname, $user, $password);
$raw_data = get_owner_data($conn);
$data = convert_to_list($raw_data);

print(json_encode($data));

pg_close();
?>
