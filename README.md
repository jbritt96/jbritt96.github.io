# Task Manager 

## Resource: Task

* Task Name
* Task Description
* Date for the day when the task will be preformed
* Completed: If the task is finished or not (0 = not complete, 1 = complete)
* Importance: How important the task is (integer 1-10)

## Database Schema

```sql
CREATE TABLE tasks(
id INTEGER PRIMARY KEY,
taskName TEXT,
taskDesc TEXT,
date TEXT,
completed INTEGER,
importance INTEGER);
```

```sql
CREATE TABLE users
id INTEGER PRIMARY KEY,
email TEXT,
password TEXT,
firstName TEXT,
lastName TEXT);
```

Method | Path | Description
-------|------|------------
- GET: /tasks (lists all tasks)
- GET: /tasks/id (retrieves single task at id)
- POST: /tasks (append item to the end)
- POST:	/users	(registers a user)
- POST: /sessions	(creates a session/login)
- DELETE: /tasks/id (deletes task at id)
- PUT: /task/id (changes information at id)

## Password Hash

The hashed used to secure passwords was bcrypt
