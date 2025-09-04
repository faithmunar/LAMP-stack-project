-- Clear tables

DROP TABLE IF EXISTS Contacts;
DROP TABLE IF EXISTS Users;

-- Create tables

CREATE TABLE `COP4331`.`Users`
(
`ID` INT NOT NULL AUTO_INCREMENT ,
`FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
`LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
`Login` VARCHAR(50) NOT NULL DEFAULT '' ,
`Password` VARCHAR(50) NOT NULL DEFAULT '' ,
PRIMARY KEY (`ID`)
) ENGINE = InnoDB;

CREATE TABLE `COP4331`.`Contacts`
(
`ID` INT NOT NULL AUTO_INCREMENT ,
`FirstName` VARCHAR(50) NOT NULL DEFAULT '' ,
`LastName` VARCHAR(50) NOT NULL DEFAULT '' ,
`Phone` VARCHAR(50) NOT NULL DEFAULT '' ,
`Email` VARCHAR(50) NOT NULL DEFAULT '' ,
`DateCreated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
`UserID` INT NOT NULL DEFAULT '0' ,
PRIMARY KEY (`ID`),
FOREIGN KEY (`UserID`) REFERENCES Users(`ID`)
) ENGINE = InnoDB;

-- Populate tables with data

INSERT INTO Users(FirstName,LastName,Login,Password)
	VALUES ('Firstname','Lastname','admin','admin123');
	
	
	
INSERT INTO Contacts(FirstName,LastName,Phone,Email,UserID)
	VALUES ('Adam','McAdam','123456789','adam@adam.com',1);
INSERT INTO Contacts(FirstName,LastName,Phone,Email,UserID)
	VALUES ('Beth','Bethington','234567890','beth@beth.gov',1);
INSERT INTO Contacts(FirstName,LastName,Phone,Email,UserID)
	VALUES ('Charlie','Charles','345678901','charles@charles.uk',1);
