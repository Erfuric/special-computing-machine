const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

const PORT = process.env.port || 3306;

// Create a connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '4s4FN06hdSQL',
  database: 'company_db'
});

// Connect to the database
function connectToDb() {
    db.connect((err) => {
      if (err) throw err;
      console.log('Connected to the database.');
      start();
    });
}
  
// Terminate the database connection
function terminateDbConnection() {
    connection.end((err) => {
        if (err) throw err;
        console.log('Connection to the database terminated.');
    });
}

// Prompt the user to choose an action
function start() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]).then(answer => {
    switch (answer.action) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        console.log('Goodbye!');
        connection.end();
        break;
    }
  });
}

// View all departments
function viewDepartments() {
    db.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// View all roles
function viewRoles() {
    db.query('SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department ON role.department_id = department.id', (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// View all employees
function viewEmployees() {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`, (err, res) => {
    if (err) throw err;
    console.table(res);
    start();
  });
}

// Add a department
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the department?'
    }
  ]).then(answer => {
    db.query('INSERT INTO department SET ?', { name: answer.name }, (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} department added successfully!`);
      start();
    });
  });
}

// Add a role
function addRole() {
    db.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the title of the role?'
      },
      {
        type: 'number',
        name: 'salary',
        message: 'What is the salary of the role?'
    },
    {
      type: 'list',
      name: 'department',
      message: 'Which department does the role belong to?',
      choices: res.map(department => department.name)
    }
  ]).then(answer => {
    const department = res.find(department => department.name === answer.department);
    db.query('INSERT INTO role SET ?', { title: answer.title, salary: answer.salary, department_id: department.id }, (err, res) => {
      if (err) throw err;
      console.log(`${res.affectedRows} role added successfully!`);
      start();
        });
    });
    });
}

// Add an employee
function addEmployee() {
    db.query('SELECT * FROM role', (err, roles) => {
      if (err) throw err;
      db.query('SELECT * FROM employee', (err, employees) => {
        if (err) throw err;
        inquirer.prompt([
          {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?"
          },
          {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?"
          },
          {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: roles.map(role => `${role.id} - ${role.title}`)
          },
          {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager?",
            choices: employees.map(employee => `${employee.id} - ${employee.first_name} ${employee.last_name}`)
          }
        ]).then(answer => {
          const role_id = answer.role.split(' ')[0];
          const manager_id = answer.manager.split(' ')[0];
          db.query('INSERT INTO employee SET ?', {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: role_id,
            manager_id: manager_id
          }, (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee added successfully!`);
            start();
          });
        });
      });
    });
}
  



// Update an employee role
function updateEmployeeRole() {
    db.query('SELECT * FROM employee', (err, employees) => {
      if (err) throw err;
      db.query('SELECT * FROM role', (err, roles) => {
        if (err) throw err;
        const employeeChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
        const roleChoices = roles.map(role => role.title);
        inquirer.prompt([
          {
            type: 'list',
            name: 'employee',
            message: "Which employee's role would you like to update?",
            choices: employeeChoices
          },
          {
            type: 'list',
            name: 'role',
            message: "What is the employee's new role?",
            choices: roleChoices
          }
        ]).then(answer => {
          const employee = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answer.employee);
          const role = roles.find(role => role.title === answer.role);
          db.query('UPDATE employee SET ? WHERE ?', [{ role_id: role.id }, { id: employee.id }], (err, res) => {
            if (err) throw err;
            console.log(`${res.affectedRows} employee role updated successfully!`);
            start();
          });
        });
      });
    });
}

// Connect to the database and start the application
db.connect(err => {
    if (err) throw err;
    console.log('Connected to database on port ' + PORT);
    start();
});
    
module.exports = db;
module.exports = viewDepartments;
module.exports = viewRoles;
module.exports = viewEmployees;
module.exports = addDepartment;
module.exports = addRole;
module.exports = addEmployee;
module.exports = updateEmployeeRole;