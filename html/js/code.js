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
  const srch = document.getElementById("searchText").value || "";
  document.getElementById("contactSearchResult").textContent = "";

  const tmp = { search: srch, userId: userId };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + '/searchContact.' + extension;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        const jsonObject = JSON.parse(xhr.responseText || "{}");
        const tbody = document.getElementById("contactBody");
        tbody.innerHTML = "";

        if (!jsonObject.results || jsonObject.results.length === 0) {
          document.getElementById("contactSearchResult").textContent = "No contacts found.";
          return;
        }

        for (let i = 0; i < jsonObject.results.length; i++) {
          const contact = jsonObject.results[i]; // [first,last,phone,email]
          const id = jsonObject.ID[i];

          const row = document.createElement("tr");
          row.dataset.id = id;

          row.innerHTML = `
            <td class="c-first">${contact[0] ?? ""}</td>
            <td class="c-last">${contact[1] ?? ""}</td>
            <td class="c-phone">${contact[2] ?? ""}</td>
            <td class="c-email">${contact[3] ?? ""}</td>
            <td>
              <button type="button" class="ContactButton btn-edit"
                      aria-label="Edit contact ${contact[0] ?? ""} ${contact[1] ?? ""}"
                      onclick="showEditFields(this, ${id})">
                <i class="fa-solid fa-user-pen" aria-hidden="true"></i>
              </button>
              <button type="button" class="ContactButton"
                      aria-label="Delete contact ${contact[0] ?? ""} ${contact[1] ?? ""}"
                      onclick="deleteContact(${id})">
                <i class="fa-solid fa-trash" aria-hidden="true"></i>
              </button>
            </td>
          `;
          tbody.appendChild(row);
        }
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").textContent = err.message;
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
}

function deleteContact(contactID){
  if (!confirm("Are you sure you want to delete this contact?")) return;

  const jsonPayload = JSON.stringify({ contactID });
  const url = urlBase + '/deleteContact.' + extension;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function(){
    if (this.readyState === 4 && this.status === 200){
      const res = JSON.parse(xhr.responseText || "{}");
      if (!res.error){
        const tr = document.querySelector(`tr[data-id="${contactID}"]`);
        if (tr) tr.remove();
      } else {
        alert(res.error);
      }
    }
  };
  xhr.send(jsonPayload);
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

function esc(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function showEditFields(btn, contactID) {
  const tr = btn.closest('tr');
  if (!tr || tr.dataset.editing === '1') return;
  tr.dataset.editing = '1';

  // Find cells
  const cFirst = tr.querySelector('.c-first');
  const cLast  = tr.querySelector('.c-last');
  const cPhone = tr.querySelector('.c-phone');
  const cEmail = tr.querySelector('.c-email');

  // Stash originals (in case of cancel)
  tr.dataset.origFirst = cFirst.textContent.trim();
  tr.dataset.origLast  = cLast.textContent.trim();
  tr.dataset.origPhone = cPhone.textContent.trim();
  tr.dataset.origEmail = cEmail.textContent.trim();

  // Swap to inputs
  cFirst.innerHTML = `<input class="edit-input" type="text" value="${esc(tr.dataset.origFirst)}">`;
  cLast.innerHTML  = `<input class="edit-input" type="text" value="${esc(tr.dataset.origLast)}">`;
  cPhone.innerHTML = `<input class="edit-input" type="text" value="${esc(tr.dataset.origPhone)}">`;
  cEmail.innerHTML = `<input class="edit-input" type="text" value="${esc(tr.dataset.origEmail)}">`;

  // Turn the edit button into Save; add Cancel
  const editBtn = tr.querySelector('.btn-edit');
  editBtn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';
  editBtn.setAttribute('aria-label','Save changes');
  editBtn.onclick = () => saveEditFields(editBtn, contactID);

  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'ContactButton btn-cancel';
  cancel.setAttribute('aria-label','Cancel edit');
  cancel.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
  cancel.onclick = () => cancelEditFields(cancel);
  editBtn.parentElement.insertBefore(cancel, editBtn.nextSibling);

  // Focus the first field
  cFirst.querySelector('input').focus();
}

function cancelEditFields(btn) {
  const tr = btn.closest('tr');
  if (!tr) return;

  tr.querySelector('.c-first').textContent = tr.dataset.origFirst || '';
  tr.querySelector('.c-last').textContent  = tr.dataset.origLast  || '';
  tr.querySelector('.c-phone').textContent = tr.dataset.origPhone || '';
  tr.querySelector('.c-email').textContent = tr.dataset.origEmail || '';

  restoreRowButtons(tr);
}

function saveEditFields(btn, contactID) {
  const tr = btn.closest('tr');
  if (!tr) return;

  const first = tr.querySelector('.c-first input').value.trim();
  const last  = tr.querySelector('.c-last input').value.trim();
  const phone = tr.querySelector('.c-phone input').value.trim();
  const email = tr.querySelector('.c-email input').value.trim();

  if (!first || !last || !phone || !email) {
    showRowStatus('Please fill in all fields.', tr, 'error');
    return;
  }

  // POST to editContact
  const payload = { contactID, firstName:first, lastName:last, phone, email };
  editContactApi(payload)
    .then(() => {
      tr.querySelector('.c-first').textContent = first;
      tr.querySelector('.c-last').textContent  = last;
      tr.querySelector('.c-phone').textContent = phone;
      tr.querySelector('.c-email').textContent = email;
      restoreRowButtons(tr);
      showRowStatus('Saved.', tr, 'success');
    })
    .catch(err => {
      showRowStatus(err || 'Save failed.', tr, 'error');
    });
}

function restoreRowButtons(tr) {
  const editBtn = tr.querySelector('.btn-edit');
  const cancel  = tr.querySelector('.btn-cancel');
  if (cancel) cancel.remove();

  editBtn.innerHTML = '<i class="fa-solid fa-user-pen" aria-hidden="true"></i>';
  editBtn.setAttribute('aria-label','Edit contact');
  editBtn.onclick = function(){ showEditFields(this, tr.dataset.id); };

  tr.dataset.editing = '0';
}

// XHR wrapper reused by saveEditFields
function editContactApi(payload){
  return new Promise((resolve, reject) => {
    const url = urlBase + '/editContact.' + extension;
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type','application/json; charset=UTF-8');
    xhr.onreadystatechange = function(){
      if (this.readyState === 4){
        if (this.status === 200){
          const res = JSON.parse(xhr.responseText || '{}');
          if (res.error) reject(res.error); else resolve(res);
        } else {
          reject('Network error');
        }
      }
    };
    xhr.send(JSON.stringify(payload));
  });
}

// Small per-row feedback in the actions cell
function showRowStatus(text, tr, kind){
  let el = tr.querySelector('.row-status');
  if (!el){
    el = document.createElement('div');
    el.className = 'row-status';
    tr.lastElementChild.appendChild(el);
  }
  el.textContent = text;
  el.className = 'row-status ' + (kind === 'error' ? 'error' : 'success');
  setTimeout(()=>{ el.textContent=''; el.className='row-status'; }, 2000);
}
