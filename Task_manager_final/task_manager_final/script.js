let currentYear;
let currentMonth;

document.addEventListener('DOMContentLoaded', function () {
    const currentDate = new Date();
    currentYear = currentDate.getFullYear();
    currentMonth = currentDate.getMonth() + 1;
    generateCalendar(currentYear, currentMonth);
    document.getElementById('prevBtn').addEventListener('click', function () {
        changeMonth(-1);
    });

    document.getElementById('nextBtn').addEventListener('click', function () {
        changeMonth(1);
    });
});

async function generateCalendar(year, month) {
    const calendarDiv = document.getElementById('calendar');
    let calendarHTML = '';

    calendarHTML += `<h2>${getMonthName(month)} ${year}</h2>`;
    calendarHTML += '<table>';
    calendarHTML += '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';

    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDayOfWeek = new Date(year, month - 1, 1).getDay();

    let dayCounter = 1;

    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';

        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < firstDayOfWeek) || dayCounter > daysInMonth) {
                calendarHTML += '<td></td>';
            } else {
                const hasTasks = await checkTasksForDay(year, month, dayCounter);

                const bgColor = hasTasks ? (await areAllTasksCompleted(year, month, dayCounter) ? 'green' : 'red') : '';

                calendarHTML += `<td onclick="handleDateClick(${year}, ${month}, ${dayCounter})" style="background-color: ${bgColor};">${dayCounter}</td>`;
                dayCounter++;
            }
        }

        calendarHTML += '</tr>';
    }

    calendarHTML += '</table>';
    calendarDiv.innerHTML = calendarHTML;

}

function getMonthName(month) {
    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    return months[month - 1];
}

function handleDateClick(year, month, day) {
    const dateStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.innerHTML = `
        <div class="popup-content">
		<button id="switchTabBtn" onclick="switchTab()">Switch Tab</button>
		<div id="tabContent">
			<div id="tab1Content">
            <p id="popupDate">You clicked on ${dateStr}</p>
				<label for="eventInput">Event:</label>
					<input type="text" id="eventInput" placeholder="Enter event...">
				<label for="timeInput">Time:</label>
					<input type="time" id="timeInput" placeholder="Select time...">
				<label for="detailInput">Details:</label>
					<input type="text" id="detailInput" placeholder="Enter task details...">
				<button class="add-btn" onclick="addEvent('${dateStr}')">Add</button>
            <table id="taskTable">
                <thead>
                    <tr>
                        <th>Task</th>
						<th>Details</th>
                        <th>Time</th>
                        <th>Completed</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            <button class="close-btn" onclick="closePopup()">Close</button>
			</div>
			<div id="tab2Content" style="display: none;">
			<button class="close-btn" onclick="closePopup()">Close</button>
			</div>
        </div>
    `;
    document.body.appendChild(popup);

    fetchTasks(dateStr);
    setTimeout(() => {
        popup.classList.add('slide-in');
    }, 10);
}
function switchTab() {
    var tab1Content = document.getElementById("tab1Content");
    var tab2Content = document.getElementById("tab2Content");

    if (tab1Content.style.display === "block") {
        tab1Content.style.display = "none";
        tab2Content.style.display = "block";
    } else {
        tab1Content.style.display = "block";
        tab2Content.style.display = "none";
    }
}
async function fetchTasks(dateStr) {
    const taskTableBody = document.querySelector('#taskTable tbody');
    const popupDateElement = document.getElementById('popupDate');

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `getTasks.php?date=${encodeURIComponent(dateStr)}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const tasks = JSON.parse(xhr.responseText);

            const allCompleted = tasks.every(task => task.completed);

            popupDateElement.style.backgroundColor = allCompleted ? 'green' : 'red';

            taskTableBody.innerHTML = '';

            tasks.forEach(task => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${task.task_text}</td>
                    <td>${task.detail_text}</td>
                    <td>${task.task_time}</td> <!-- New line -->
                    <td><input type="checkbox" ${task.completed ? 'checked' : ''} onclick="updateTaskStatus(${task.id}, this.checked)"></td>
                    <td><button onclick="deleteTask(${task.id})">Delete</button></td>
                `;
                taskTableBody.appendChild(row);
            });
        }
    };

    xhr.send();
}


function openPopup() {
    const popup = document.querySelector('.popup');
    popup.classList.add('slide-in');
}

function closePopup() {
    const popup = document.querySelector('.popup');

    popup.classList.add('slide-out');
    setTimeout(() => {
        document.body.removeChild(popup);
    }, 300);
}


function changeMonth(delta) {
    currentMonth += delta;

    if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    } else if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    }

    generateCalendar(currentYear, currentMonth);
}

function addEvent(dateStr) {
    const eventInput = document.getElementById('eventInput');
    const detailInput = document.getElementById('detailInput');
	const timeInput = document.getElementById('timeInput');
    const eventText = eventInput.value.trim();
    const detailText = detailInput.value.trim();
	const timeText = timeInput.value.trim();

    if (eventText !== '') {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'addEvent.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                alert(xhr.responseText);
				location.reload();
                eventInput.value = '';
                detailInput.value = '';

                closePopup();

                generateCalendar(currentYear, currentMonth);
            }
        };

        xhr.send(`eventText=${encodeURIComponent(eventText)}&detailText=${encodeURIComponent(detailText)}&timeText=${encodeURIComponent(timeText)}&date=${encodeURIComponent(dateStr)}`);
}
}


function updateTaskStatus(taskId, completed) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'updateTaskStatus.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                alert(xhr.responseText);
				location.reload();
                const checkbox = document.querySelector(`#taskTable input[data-task-id="${taskId}"]`);
                if (checkbox) {
                    checkbox.checked = completed;
                }
            } else {
                alert('Error updating task status');
            }
        }
    };
    xhr.send(`taskId=${encodeURIComponent(taskId)}&completed=${encodeURIComponent(completed ? 1 : 0)}`);
}

async function checkTasksForDay(year, month, day) {
    const dateStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    const url = `getTasks.php?date=${encodeURIComponent(dateStr)}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const tasks = await response.json();

            return tasks.length > 0;
        } else {
            console.error('Failed to fetch tasks:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return false;
    }
}
async function areAllTasksCompleted(year, month, day) {
    const dateStr = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    const url = `getTasks.php?date=${encodeURIComponent(dateStr)}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const tasks = await response.json();

            return tasks.every(task => task.completed);
        } else {
            console.error('Failed to fetch tasks:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return false;
    }
}
function deleteTask(taskId) {
    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (confirmDelete) {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'deleteTask.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    alert(xhr.responseText);

                    location.reload();
                } else {
                    alert('Error deleting task');
                }
            }
        };
        xhr.send(`taskId=${encodeURIComponent(taskId)}`);
    }
}
