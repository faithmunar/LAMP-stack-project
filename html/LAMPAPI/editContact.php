<?php

	$inData = getRequestInfo();
	
    $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$editID = intval(trim($inData["contactID"]));

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		// Checks to makes sure ID is in the table
		$result = $conn->query("SELECT * FROM Contacts WHERE ID = $editID");
		if($result->num_rows == 0) {
    		returnWithError("No contact with ID $editID found");
		}

		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? where ID=?");
		$stmt->bind_param("ssssi",$firstName,$lastName, $phone, $email, $editID); 

        if($stmt->execute())
        {
            // ID's should be unique, so no more than 1 should be edited
            if($stmt->affected_rows == 1)
                returnWithMessage("Edit Successful");
            else if(($stmt->affected_rows == 0))
				returnWithError("Contact not found");
			else
                returnWithError("More than one entry edited");
        }
        else
            returnWithError("Contact not found");
	}
		
		$stmt->close();
		$conn->close();

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithMessage($message)
	{
		$retValue = '{"message":"'. $message .'"}';
		sendResultInfoAsJson( $retValue );
		exit();
	}

	function returnWithError($error)
	{
		$retValue = '{"error":"'. $message .'"}';
		sendResultInfoAsJson( $retValue );
		exit();
	}
	
?>