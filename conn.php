<?php
$serverName = "iframedb.database.windows.net";
$connectionOptions = array(
    "Database" => "iframeDB",
    "Authentication" => "ActiveDirectoryIntegrated",
    "UID" => "sql_admin",
    "PWD" => "Skrellispann789!?"
);
$conn = sqlsrv_connect($serverName, $connectionOptions);
if ($conn === false) {
    die(print_r(sqlsrv_errors(), true));
}

// Create a table
$sql = "CREATE TABLE TestTable (ID INT NOT NULL PRIMARY KEY, Name NVARCHAR(50))";
$stmt = sqlsrv_query($conn, $sql);
if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}

// Insert data into the table
$sql = "INSERT INTO TestTable (ID, Name) VALUES (?, ?)";
$params = array(1, "John Doe");
$stmt = sqlsrv_query($conn, $sql, $params);
if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}

// Query the table
$sql = "SELECT * FROM TestTable";
$stmt = sqlsrv_query($conn, $sql);
if ($stmt === false) {
    die(print_r(sqlsrv_errors(), true));
}

// Fetch the results
while ($row = sqlsrv_fetch_array($stmt, SQLSRV_FETCH_ASSOC)) {
    echo $row['ID'] . ", " . $row['Name'] . "\n";
}

sqlsrv_free_stmt($stmt);
sqlsrv_close($conn);
?>