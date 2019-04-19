var TASKS = {};

function deleteRowWithId(rowid)  
{   
    var row = document.getElementById(rowid);
    row.parentNode.removeChild(row);
}

function removeElement(elementId) {
    var element = document.getElementById(elementId);
    element.parentNode.removeChild(element);
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

class Task {
	constructor(task, desc, date, completed, importance, id){
		this.task = task;
		this.desc = desc;
		this.date = date;
		this.completed = completed;
		this.importance = importance;
		this.id = id;
	}

	task(){
		return this.task;
	}
	desc(){
		return this.desc;
	}
	date(){
		return this.date;
	}

}


var firstTimeLoading = true;
var notLoggedInDiv = document.getElementById("notLoggedIn");
var registrationDiv = document.getElementById("registration")
function updateTaskBank(){
	fetch("https://server-for-task-manager.herokuapp.com/tasks", {
		credentials: 'include'
	}).then(function(response){
		if (response.status == 401){
			// TODO: SHOW the login
			notLoggedInDiv.style.display = "none";
			return;
		}

		if (response.status != 200){
			//SOMETHING WEIRD HAPPENED
			notLoggedInDiv.style.display = "none";
			return;
		}



		response.json().then(function(data){
			// TODO show the appropriate divs
			notLoggedInDiv.style.display = "inline";
			registrationDiv.style.display = "none"

			TASKS = data;
			console.log(TASKS);

			if(firstTimeLoading == false) {
				console.log("not the first");
				//var new_tbody = document.createElement("tbody");
				//table.parentNode.replaceChild(new_tbody, table);
				table.innerHTML = "";
			}

			
			if (firstTimeLoading == true) {
				firstTimeLoading = false;
				//for (var i = 0; i < TASKS.length; i++) {
				//	createRow(TASKS[i].taskName, TASKS[i].taskDesc, TASKS[i].date,
				//	TASKS[i].completed, TASKS[i].importance, TASKS[i].id);
				//}
			}
			console.log("finished loading all tasks");
			
			
			for (var i = 0; i < TASKS.length; i++) {
				createRow(TASKS[i].taskname, TASKS[i].taskdesc, TASKS[i].date,
				TASKS[i].completed, TASKS[i].importance, TASKS[i].id);
			}

		});
	});	
}

var displayRegistrationError = document.getElementById("registration-error");
var registerUser = function(email, password, firstName, lastName){
	var data = "userEmail=" + encodeURIComponent(email);
	data += "&password=" + encodeURIComponent(password);
	data += "&firstName=" + encodeURIComponent(firstName);
	data += "&lastName=" + encodeURIComponent(lastName);

	fetch("https://server-for-task-manager.herokuapp.com/users", {
		method: 'POST',
		body: data,
		credentials: 'include',
		headers: {
		  "Content-type": "application/x-www-form-urlencoded"
		}
	}).then(function (response) {
		if (response.status == 422){
			console.log("user exists");
			displayRegistrationError.innerHTML = "User exists";
		}else{
			console.log("users registered");
			loginUser(email, password);
		}
	});
};

var displayWelcomeUser = document.getElementById("welcome-message");
var displayLoginError = document.getElementById("login-error");
var loginUser = function(email, password){
	var data = "email=" + encodeURIComponent(email);
	data += "&password=" + encodeURIComponent(password);


	fetch("https://server-for-task-manager.herokuapp.com/sessions", {
		method: 'POST',
		body: data,
		credentials: 'include',
		headers: {
		  "Content-type": "application/x-www-form-urlencoded"
		}
	}).then(function (response) {
		if (response.status == 401){
			displayLoginError.innerHTML = "Email/Password is incorrect";

		}else{
			console.log("loggedin");

			response.json().then(function(data){
			
			console.log(data);
			displayWelcomeUser.innerHTML = "Welcome back " + data;
			});


			
			
			updateTaskBank();
		}
	});
}

var updateTask = function (name, desc, date, completed, importance, id) {
	var data = "taskName=" + encodeURIComponent(name);
	data += "&taskDesc=" + encodeURIComponent(desc);
	data += "&date=" + encodeURIComponent(date);
	data += "&completed=" + encodeURIComponent(completed);
	data += "&importance=" + encodeURIComponent(importance);
	console.log(data);


	fetch("https://server-for-task-manager.herokuapp.com/tasks/"+ (id+1), {
		method: 'PUT',
		body: data,
		credentials: 'include',
		headers: {
			"Content-type": "application/x-www-form-urlencoded"
		}
	}).then(function (response) {
		console.log("task updated.");
		updateTaskBank();
	});
};

var createTask = function (name, desc, date, completed, importance) {
	var data = "taskName=" + encodeURIComponent(name);
	data += "&taskDesc=" + encodeURIComponent(desc);
	data += "&date=" + encodeURIComponent(date);
	data += "&completed=" + encodeURIComponent(completed);
	data += "&importance=" + encodeURIComponent(importance);

	fetch("https://server-for-task-manager.herokuapp.com/tasks", {
		method: 'POST',
		body: data,
		credentials: 'include',
		headers: {
		  "Content-type": "application/x-www-form-urlencoded"
		}
	}).then(function (response) {
		console.log("task saved.");
		updateTaskBank();
	});
};

var deleteTask = function (id) {
	fetch(`https://server-for-task-manager.herokuapp.com/tasks/${id}`, {
		method: 'DELETE',
		credentials: 'include'
	}).then(function (response) {
		updateTaskBank();
		console.log("task deleted");
	})
}



var createRow = function (name, desc, date, completed, importance, id) {
	var row = table.insertRow(-1);
	row.id = id;

	var cell0 = row.insertCell(0);
	var cell1 = row.insertCell(1);
	var cell2 = row.insertCell(2);
	var cell3 = row.insertCell(3);
	var cell4 = row.insertCell(4);
	var cell5 = row.insertCell(5);
	var cell6 = row.insertCell(6);

	cell0.innerHTML = id;
	cell1.innerHTML = name;
	cell2.innerHTML = desc;
	cell3.innerHTML = date;
	if (completed == 0){
		cell4.innerHTML = "Not yet done";
		var completeButton = document.createElement("button");
		completeButton.innerHTML = "Done";
		cell4.appendChild(completeButton);
		completeButton.onclick = function () {
			cell0.style.backgroundColor = "green";
			cell0.style.color = "white";
			cell1.style.backgroundColor = "green";
			cell1.style.color = "white";
			cell2.style.backgroundColor = "green";
			cell2.style.color = "white";
			cell3.style.backgroundColor = "green";
			cell3.style.color = "white";
			cell4.style.backgroundColor = "green";
			cell4.style.color = "white";
			cell4.innerHTML = "Completed"
			cell5.style.backgroundColor = "green";
			cell5.style.color = "white";
			cell6.style.backgroundColor = "green";
			cell6.style.color = "white";
			updateTask(name, desc, date, 1, importance, (id-1));
		};
	} else {
		cell4.innerHTML = "Completed";
		cell0.style.backgroundColor = "green";
		cell0.style.color = "white";
		cell1.style.backgroundColor = "green";
		cell1.style.color = "white";
		cell2.style.backgroundColor = "green";
		cell2.style.color = "white";
		cell3.style.backgroundColor = "green";
		cell3.style.color = "white";
		cell4.style.backgroundColor = "green";
		cell4.style.color = "white";
		cell4.innerHTML = "Completed"
		cell5.style.backgroundColor = "green";
		cell5.style.color = "white";
		cell6.style.backgroundColor = "green";
		cell6.style.color = "white";
	}
	
	cell5.innerHTML = importance;

	var deleteButton = document.createElement("button");
	deleteButton.innerHTML = "Delete";
	deleteButton.id = totalRows;
	cell6.appendChild(deleteButton);
	deleteButton.onclick = function () {
		var deleteBool = confirm("Would you like to delete this task?");
		console.log(deleteBool);
		if (deleteBool == true){
			deleteTask(id);
			deleteRowWithId(id);
		}
	};
}



var emailLabel = document.getElementById("email-label");
var passwordLabel = document.getElementById("password-label");
var firstNameLabel = document.getElementById("firstName-label");
var lastNameLabel = document.getElementById("lastName-label");
var registerButton = document.getElementById("register");
var registerUserOpen = false;
registerButton.onclick = function () {
	displayRegistrationError.innerHTML = "";
	//registerUser("asdfasdf@gmail.com", "1234562345");
	emailLabel.innerHTML = "Email:";
	var emailInput = document.createElement("INPUT");
	emailInput.setAttribute("type", "text");
	emailInput.id = "email-input";
	emailLabel.appendChild(emailInput);

	passwordLabel.innerHTML = "Password:";
	var passwordInput = document.createElement("INPUT");
	passwordInput.setAttribute("type", "password");
	passwordInput.id = "email-input";
	passwordLabel.appendChild(passwordInput);

	firstNameLabel.innerHTML = "First Name:";
	var firstNameInput = document.createElement("INPUT");
	firstNameInput.setAttribute("type", "text");
	firstNameInput.id = "firstName-input";
	firstNameLabel.appendChild(firstNameInput);

	firstNameLabel.innerHTML = "First Name:";
	var firstNameInput = document.createElement("INPUT");
	firstNameInput.setAttribute("type", "text");
	firstNameInput.id = "firstName-input";
	firstNameLabel.appendChild(firstNameInput);

	lastNameLabel.innerHTML = "Last Name:";
	var lastNameInput = document.createElement("INPUT");
	lastNameInput.setAttribute("type", "text");
	lastNameInput.id = "lastName-input";
	lastNameLabel.appendChild(lastNameInput);

	var registerButtonDiv = document.getElementById("registerUserButtonDiv");
	if (registerUserOpen == false){
		var registerUserButton = document.createElement("button");
		registerUserButton.innerHTML = "Submit";
		registerButtonDiv.appendChild(registerUserButton);
		registerUserButton.onclick = function () {
			registerUser(emailInput.value, passwordInput.value, firstNameInput.value, lastNameInput.value);
			emailLabel.innerHTML = "";
			passwordLabel.innerHTML = "";
			firstNameLabel.innerHTML = "";
			lastNameLabel.innerHTML = "";
			registerUserButton.remove();
			registerUserOpen = false;
		};
	}
	registerUserOpen = true;
};

var emailLoginInput = document.getElementById("login-email");
var passwordLoginInput = document.getElementById("login-password");
var loginButton = document.getElementById("log-in");
loginButton.onclick = function () {
	loginUser(emailLoginInput.value, passwordLoginInput.value);
}

emailLoginInput.onclick = function () {
	displayLoginError.innerHTML = "";
}




var totalRows = 0;

const task = new Task("walk dog", "Go around block", "10-28-2019");

/*var generateButton = document.querySelector("#generate-button");
generateButton.onclick = function () {
	var randomTaskText = document.querySelector("#random-task-text");
	var randomNum = getRandomInt(randomTasks.length);
	randomTaskText.innerHTML = randomTasks[randomNum];	
}*/


/* UPDATE TASk
var nameUpdateLabel = document.getElementById("name-label");
var descUpdateLabel = document.getElementById("desc-label");
var dateUpdateLabel = document.getElementById("date-label");
var completedUpdateLabel = document.getElementById("completed-label");
var importanceUpdateLabel = document.getElementById("importance-label");

var updateIDinput = document.querySelector("#task-selector");
var getTaskButton = document.querySelector("#update-search-task-button");
var editInputsOpen = false;
getTaskButton.onclick = function () {
	index = updateIDinput.value - 1;
	console.log(TASKS[index].taskName);


    nameUpdateLabel.innerHTML = "Task Name:";
	var nameUpdateInput = document.createElement("INPUT");
	nameUpdateInput.value = TASKS[index].taskName;
	nameUpdateInput.setAttribute("type", "text");
	nameUpdateInput.id = "task-name-update";
	nameUpdateLabel.appendChild(nameUpdateInput);

	descUpdateLabel.innerHTML = "Task Desc:";
	var descUpdateInput = document.createElement("INPUT");
	descUpdateInput.value = TASKS[index].taskDesc;
	descUpdateInput.setAttribute("type", "text");
	descUpdateInput.id = "task-desc-update";
	descUpdateLabel.appendChild(descUpdateInput);

	dateUpdateLabel.innerHTML = "Date:";
	var dateUpdateInput = document.createElement("INPUT");
	dateUpdateInput.value = TASKS[index].date;
	dateUpdateInput.setAttribute("type", "text");
	dateUpdateInput.id = "task-date-update";
	dateUpdateLabel.appendChild(dateUpdateInput);

	completedUpdateLabel.innerHTML = "Completed:";
	var completedUpdateInput = document.createElement("INPUT");
	completedUpdateInput.value = TASKS[index].completed;
	completedUpdateInput.setAttribute("type", "text");
	completedUpdateInput.id = "task-completed-update";
	completedUpdateLabel.appendChild(completedUpdateInput);

	importanceUpdateLabel.innerHTML = "Importance:";
	var importanceUpdateInput = document.createElement("INPUT");
	importanceUpdateInput.value = TASKS[index].importance;
	importanceUpdateInput.setAttribute("type", "text");
	importanceUpdateInput.id = "task-importance-update";
	importanceUpdateLabel.appendChild(importanceUpdateInput);


	var updateButtonDiv = document.getElementById("buttonUpdate");
	if (editInputsOpen == false){
		var updateTaskButton = document.createElement("button");
		updateTaskButton.innerHTML = "Update";
		updateButtonDiv.appendChild(updateTaskButton);
		updateTaskButton.onclick = function () {
			updateTask(nameUpdateInput.value, descUpdateInput.value, dateUpdateInput.value, 
				completedUpdateInput.value, importanceUpdateInput.value, index);
			nameUpdateLabel.innerHTML = "";
			//removeElement("task-name-update");
			descUpdateLabel.innerHTML = "";
			//descUpdateInput.remove();
			dateUpdateLabel.innerHTML = "";
			//dateUpdateInput.remove();
			completedUpdateLabel.innerHTML = "";
			//completedUpdateInput.remove();
			importanceUpdateLabel.innerHTML = "";
			//importanceUpdateInput.remove();
			updateTaskButton.remove();
			editInputsOpen = false;
		};
	}
	editInputsOpen = true;

};
*/

var table = document.querySelector("#task-table");

var taskInput = document.getElementById("task-input");
var taskDesc = document.getElementById("task-desc");
var taskDate = document.getElementById("task-date");
var taskImportance = document.getElementById("task-importance");


var taskButton = document.querySelector("#task-button");
taskButton.onclick = function () {
	//var taskList = document.querySelector("#todo-list");
	
	//var newItem = document.createElement("li");
	totalRows = totalRows + 1;
	//newItem.innerHTML = taskInput.value;
	//taskList.appendChild(newItem);

	createTask(taskInput.value, taskDesc.value, 
		taskDate.value,0, taskImportance.value);
	

	taskInput.value = "";
	taskDesc.value = "";
	taskImportance.value = "";


	
};
updateTaskBank();