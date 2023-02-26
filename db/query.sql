-- View all departments
SELECT id, department_name FROM department;

-- View all roles
SELECT role.id, title, salary, department_name 
FROM role 
JOIN department ON role.department_id = department.id;

-- View all employees
SELECT e.id, e.first_name, e.last_name, title, department_name, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee AS e
JOIN role ON e.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee AS m ON e.manager_id = m.id;

-- Add a department
INSERT INTO department (department_name) VALUES ('<department_name>');

-- Add a role
INSERT INTO role (title, salary, department_id) 
VALUES ('<title>', <salary>, <department_id>);

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('<first_name>', '<last_name>', <role_id>, <manager_id>);

-- Update an employee role
UPDATE employee 
SET role_id = <role_id> 
WHERE id = <employee_id>;

-- Update employee managers
UPDATE employee 
SET manager_id = <new_manager_id>
WHERE id = <employee_id>;

-- View employees by manager
SELECT CONCAT(m.first_name, ' ', m.last_name) AS manager, e.id, e.first_name, e.last_name, title, department_name, salary 
FROM employee AS e
JOIN role ON e.role_id = role.id
JOIN department ON role.department_id = department.id
JOIN employee AS m ON e.manager_id = m.id
WHERE m.id = <manager_id>;

-- View employees by department
SELECT e.id, e.first_name, e.last_name, title, department_name, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee AS e
JOIN role ON e.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee AS m ON e.manager_id = m.id
WHERE department.id = <department_id>;

-- Delete departments, roles and employees
DELETE FROM department WHERE id = <department_id>;
DELETE FROM role WHERE id = <role_id>;
DELETE FROM employee WHERE id = <employee_id>;