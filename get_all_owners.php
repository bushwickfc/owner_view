<?php
include "credentials.php";

$conn = pg_connect("host=$host dbname=$dbname user=$user password=$password");
$result = pg_query($conn, "SELECT * FROM owner");

# pg_fetch_all will retun the results as a list of objects, which can then be JSON-encoded and passed to the client.
print(json_encode(pg_fetch_all($result)));

pg_close();

?>
