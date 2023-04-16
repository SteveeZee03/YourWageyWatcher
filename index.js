const mysql = require('mysql2');
const cTable = require('console.table');
const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: '330iS4.Merc!',
        database: 'staff_db'
    },
    console.log("You're in the Staff Database.")
);

const inquirer = require('inquirer');

const userPrompt = () => {
    return inquirer.prompt([
        {
        type: 'list',
        message: "Which of the following choice would you like to take?",
        name: 'selection',
        choices: [
            "View all Departments",
            "View all Roles",
            "View all Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update Employee Role"
        ]
    }
    ])
    .then((data) => {
        switch (data.selection) {
            case "View all Departments":
                viewAllDepartments();
            break;

            case "View all Roles":
                viewAllRoles();
            break;

            case "View all Employees":
                viewAllEmployees();
            break;

            case "Add Department":
                addDepartment();
            break;

            case "Add Role":
                addRole();
            break;

            case "Add Employee":
                addEmployee();
            break

            case "Update Employee Role":
                updateEmployeeRole();
            break;
        }
    })
}


userPrompt();

const viewAllDepartments = () => {
    db.query(`SELECT * FROM department`, function (err, results) {
        console.log(`\n`);
        console.table(results);
        userPrompt();
    })
}

const viewAllRoles = () => {
    db.query(`SELECT * FROM role`, function (err, results) {
        console.log(`\n`);
        console.table(results);
        userPrompt();
    })
}

const viewAllEmployees = () => {
    db.query(`
    SELECT
    employee_with_managers.id AS employee_id,
    employee_with_managers.first_name,
    employee_with_managers.last_name,
    employee_info.title,
    employee_info.salary,
    employee_info.department_name,
    employee_with_managers.manager_name
    FROM employee_info
    JOIN employee_with_managers ON employee_info.role_id = employee_with_managers.role_id;
    `, function (err, results) {
        console.log(`\n`);
        console.table(results);
        userPrompt();
    })
}
const addDepartment = () => {
    return inquirer.prompt([
        {
            type: "input",
            message: "Enter the name of your New Department.",
            name: "name"
        }
    ])
    .then((data) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, data.name, (err, results) => {
            console.log("Added New Department!");
            viewAllDepartments()
        })
    })
}
const addRole = () => {
    let departmentArray = [];
db.query(`SELECT * FROM department`, function (err, results) {
    for (let i = 0; i < results.length; i++) {
        departmentArray .push(results[i].name);
    }
return inquirer.prompt([
    {
        type: "input",
        message: "Insert the name of your New Role.",
        name:"title",
    },
    {
        type: 'input',
        message: "Insert the Salary of your New Role.",
        name: "salary",
    },
    {
        type: "list",
        message: "Which department does this Role fall under?",
        name: "department",
        choices: departmentArray
    }
])
.then((data) => {

    db.query(`SELECT id FROM department WHERE department.name = ?`, data.department, (err, results) => {
        let department_id = results[0].id;
    db.query(`INSERT INTO role(title, salary, department_id)
    VALUES (?,?,?)`, [data.title, data.salary, department_id], (err, results) => {
        console.log("Added New Role!");
        viewAllRoles();
    })
    });
})
})
}

const addEmployee = () => {
    const roleArray = [];
    const employeeArray = [];

    db.query(`SELECT * FROM role`, function (err, results) {
        for (let i =0; i < results.length; i++) {
            roleArray.push(results[i].title);
        }

    db.query(`SELECT  * FROM employee`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let employeeName = `${results[i].first_name} ${results[i].last_name}`
            employeeArray.push(employeeName);
        }
        return inquirer.prompt([
            {
                type: "input",
                message: "Enter employee First Name.",
                name: 'first_name'
            },
            {
                type: "input",
                message: "Enter employee Last Name.",
                name: "last_name"
            },
            {
                type: "list",
                message: "Enter employee Role.",
                choices: roleArray,
                name: 'role'
            },
            {
                type: "list",
                message:"Is your employee under jurisdiction of a Manager?",
                choices: ["Yes", "No"],
                name: "yn_manager"
            }
        ]).then((data) => {
            let roleName = data.role;
            let first_name = data.first_name;
            let last_name = data.last_name; 
            let role_id = '';
            let manager = '';

            db.query(`SELECT id FROM role WHERE role.title = ?`, data.role, (err, results) => {
                role_id = results[0].id;
            });
            if (data.yn_manager === "Yes") {
                return inquirer.prompt([
                    {
                        type: 'list',
                        message: "Select The Employees manager",
                        choice: employeeArray,
                        name: 'manager'
                    }
                ]).then ((data) => {

                    db.query(`SELECT id FROM role WHERE role.title = ?`, roleName, (err, results) => {
                        role_id = results[0].id;
                    })
                    db.query(`SELECT id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?;`, data.manager.split(""), (err, results) => {
                        manager = results[0].id;
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES (?,?,?,?)`, [first_name, last_name, role_id, manager], (err, results) => {
                        console.log("Added New Employee!");
                    viewAllEmployees();
                    })
                    })
                })
            } else {

                manager = null;

                db.query(`SELECT id FROM role WHERE role.title =?`, roleName, (err, results) => {
                    role_id = results[0].id;

                db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (?,?,?,?)`, [data.first_name, data.last_name, role_id, manager], (err, results) => {
                    console.log("Added New Employee!");
                viewAllEmployees();
                })
                })
            }
        })
    })
    })
}


const updateEmployeeRole = () => {
    const roleArray = [];
    const employeeArray = [];

    db.query(`SELECT * FROM role`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            roleArray.push(results[i].title);
        }

    db.query(`SELECT * FROM employee`, function (err, results) {
        for (let i = 0; i < results.length; i++) {
            let employeeName = `${results[i].first_name} ${results[i].last_name}`
            employeeArray.push(employeeName);
        }
    return inquirer.prompt([
        {
            type: "list",
            message: "Select Employee to Update Role.",
            choices: employeeArray,
            name: 'employee'
        },
        {
            type: "list",
            message: "Select Employee New Role.",
            choices: roleArray,
            name: "role"
        },
    ]).then((data) => {

        db.query(`SELECT id FROM role WHERE role.title = ?;`, data.role, (err, results) => {
            role_id = results[0].id;
        db.query(`SELECT id FROM employee WHERE employee.first_name = ? AND employee.last_name = ?;`, data.employee.split(""), (err,results) => {
        db.query(`UPDATE employee SET role_id = ? WHERE id =?;`, [role_id, results[0].id], (err, results) => {
            console.log("Updated Employee Role!");
        viewAllEmployees();
        })
        })
        })
        
    })
    })
    })
};