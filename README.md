# Owner View

Just a single index page to give staff/owners a quick look at the data in the owner database, without requiring any credentials.

The script reads the `owner_view` table and renders it as an HTML table. The live app can be found at

http://db.bushwickfoodcoop.org/tools/owner_view/index.html

## Requirements

This app requires a root-level copy of a `credentials.php` file to run. This file should be gitignored, and should have credentials for the Bushwick Food Coop's Postgres instance, formatted like so:

```php
<?php
$user = "XXX";
$password = "XXX";
$host = "XXX";
$dbname = "XXX";
?>
```

Contact the Bushwick Food Coop Tech Committee for the contents of this file.
