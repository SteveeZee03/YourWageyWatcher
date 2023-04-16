INSERT INTO department(name)
VALUE ("Finance"), ("Marketing"), ("Sales"), ("Legal"), ("Tech");

INSERT INTO role(title, salary, department_id)
VALUES ("Accountant",82000, 1),
    ("Associate",30000, 1),
    ("Lead Marketer",98000, 2),
    ("Salesman",70000, 3),
    ("Lawyer",190000, 4),
    ("Developer",115000, 5),
    ("Intern",75000, 5),
    ("CyberSecurity",120000, 5);




INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Kevin", "M", 1, NULL),
    ("Andrew", "T", 3, NULL),
    ("Nate", "Trist", 5, 2),
    ("Geralt", "of Rivia", 2, 3),
    ("Kentrell", "Gaulden", 3, 3),
    ("Jo", "Mahmaw", 4, 2);


    CREATE VIEW employee_info AS 
    (SELECT
    role.id AS role_id,
    role.title,
    role.salary,
    department.name AS department_name
    FROM role
    JOIN department
    ON role.department_id = department.id);

    CREATE VIEW employee_with_managers AS
    (SELECT emp.id,
    emp.first_name,
    emp.last_name,
    emp.role_id,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
    FROM employee AS manager RIGHT OUTER JOIN employee AS emp ON manager.id = emp.manager_id);