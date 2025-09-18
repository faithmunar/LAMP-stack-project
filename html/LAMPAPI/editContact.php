<?php

	$inData = getRequestInfo();
	
    $firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$editID = $inData["contactId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithMessage( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? where ID=?");
		$stmt->bind_param("sssss",$firstName,$lastName, $phone, $email, $editID); 

        if($stmt->execute() === TRUE)
        {
            // ID's should be unique, so no more than 1 should be edited
            if($stmt->affected_rows == 1)
                returnWithMessage("Edit Successful");
            else
                returnWithMessage("More than one entry edited");
        }
        else
            returnWithMessage("Contact not found");
		
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
	
	function returnWithMessage($message)
	{
		$retValue = '{"error":'. $message .'}';
		sendResultInfoAsJson( $retValue );
	}
	
?>