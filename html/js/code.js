const urlBase = 'http://4331group19.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.body.classList.add("logged-in");
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	console.log(jsonPayload);

	let url = urlBase + '/searchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("contactSearchResult").innerHTML = jsonObject.error;
				
                const tbody = document.getElementById("contactBody");
                tbody.innerHTML = "";

                for (let i = 0; i < jsonObject.results.length; i++)
                {
                    const row = document.createElement("tr");

                    const contact = jsonObject.results[i];

                    row.innerHTML = `
                        <td>${contact[0]}</td>
                        <td>${contact[1]}</td>
                        <td>${contact[2]}</td>
                        <td>${contact[3]}</td>
                        <td>
                            <button type="button" class="ContactButton" aria-label="Edit Contact" onclick=editContact(${jsonObject.ID[i]});"> 
								<i class="fa-solid fa-user-pen"></i>
							</button>
							<button type="button" class="ContactButton" aria-label="Delete Contact" onclick="deleteContact(${jsonObject.ID[i]});"> 
								<i class="fa-solid fa-trash"></i>
							 </button>
                        </td>
                    `;
                    tbody.appendChild(row);
                }
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function openRegister()
{
	window.location.href = "register.html";
}

function doRegister()
{         
	let newUsername = document.getElementById("registerName").value;
	let newPassword = document.getElementById("registerPassword").value;
	let newFirstName = document.getElementById("firstName").value;
	let newLastName = document.getElementById("lastName").value;

	document.getElementById("registerResult").innerHTML = "";

	let tmp = {login:newUsername,password:newPassword,firstName:newFirstName,lastName:newLastName,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/Register.' + extension;
	//let url = 'http://4331group19.xyz/LAMPAPI/Register.php';
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			console.log("ReadyState: " + this.readyState + "\nStatus: " + this.status);
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("registerResult").innerHTML = jsonObject.error;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function openLogin()
{
	window.location.href = "index.html";

}

function addContact()
{
	let newPhoneNumber = document.getElementById("registerPhoneNumber").value.trim();
	let newEmail = document.getElementById("registerEmail").value.trim();
	let newFirstName = document.getElementById("firstName").value.trim();
	let newLastName = document.getElementById("lastName").value.trim();

	if (!newFirstName || !newLastName || !newPhoneNumber || !newEmail) {
	    document.getElementById("contactAddResult").textContent = "Please fill in all fields before adding a contact.";
	    return;
  	}

	let tmp = {firstName:newFirstName,lastName:newLastName,email:newEmail,phone:newPhoneNumber,userId:userId};

	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("contactAddResult").innerHTML = jsonObject.error;

				if (!jsonObject.error) 
				{ 
					document.getElementById("registerPhoneNumber").value = "";
				  	document.getElementById("registerEmail").value = "";
				  	document.getElementById("firstName").value = "";
				  	document.getElementById("lastName").value = "";

          			searchContact();
         			document.getElementById("firstName").focus();
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

	showTable();
	searchContact();
}

function deleteContact(contactID)
{
	//let newContactID = document.getElementById(contactID).value;

	let confirmDelete = confirm("Are you sure you want to delete this contact?");
    if (!confirmDelete) {
        return;
    }

	let tmp = {contactID:contactID};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/deleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				document.getElementById(contactID).innerHTML = jsonObject.error;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById(contactID).innerHTML = err.message;
	}

	searchContact();
}

function editContact()
{
	let newPhoneNumber = document.getElementById("registerPhoneNumber").value;
	let newEmail = document.getElementById("registerEmail").value;
	let newFirstName = document.getElementById("firstName").value;
	let newLastName = document.getElementById("lastName").value;
	let newContactID = document.getElementById("__TEMP__").value;

	let tmp = {firstName:newFirstName,lastName:newLastName,email:newEmail,phone:newPhoneNumber,contactID:newContactID};

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/editContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				document.getElementById("__TEMP__").innerHTML = jsonObject.error;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("__TEMP__").innerHTML = err.message;
	}

}

function showTable()
{
	const addContactDiv = document.getElementById("addContact");
	if (addContactDiv.style.display === "none" || addContactDiv.style.display === "") {
	    addContactDiv.style.display = "block";
	} else {
	    addContactDiv.style.display = "none";
	}
}






