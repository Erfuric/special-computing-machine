INSERT INTO department (department_name) VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role (title, salary, department_id) VALUES 
('Salesperson', 50000.00, 1),
('Sales Lead', 75000.00, 1),
('Lead Engineer', 95000.00, 2),
('Software Engineer', 75000.00, 2),
('Accountant', 65000.00, 3),
('Legal Team Lead', 85000.00, 4),
('Lawyer', 75000.00, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Tony', 'Stark', 1, NULL),
('Bruce', 'Banner', 2, 1),
('Steve', 'Rogers', 3, NULL),
('Peter', 'Parker', 4, 3),
('Thor', 'Odinson', 5, 3),
('Clinton', 'Barton', 6, NULL),
('Wanda', 'Maximoff', 7, 6);