<?php

$inData = getRequestInfo();

	$searchResults = "";
	$contactIDs = "";
	$searchCount = 0;
    $userId = $inData["userId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * from Contacts WHERE CONCAT_WS(' ', FirstName, LastName, Phone, Email) LIKE ? and UserID=?");
		$searchKeyword = "%" . $inData["search"] . "%";
		$stmt->bind_param("ss",$searchKeyword, $userId); 
		$stmt->execute();

		$result = $stmt->get_result();

		// Iterates through each Contact that contains the searchKeyword
		while($row = $result->fetch_assoc())
		{
			if($searchCount > 0)
			{
				$searchResults .= ",";
				$contactIDs .= ",";
			}
			$searchCount++;

			// Adds the contact to the result array and to a ID array
			$searchResults .= '"' . $row["FirstName"] . ' ' . $row["LastName"] . ' ' . $row["Phone"] . ' ' . $row["Email"] .'"';
			$contactIDs .= '"' . $row["ID"] . '"';
		}

		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults, $contactIDs );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"results":[], "ID":[], "error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($searchResults, $contactIDs)
	{
		$retValue = '{"results":[' . $searchResults . '], "ID":[' . $contactIDs . '], "error":""}';
		sendResultInfoAsJson( $retValue );
	}	
?>