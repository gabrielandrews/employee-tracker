const inquirer = require("inquirer")
const cTable = require('console.table');
const EmployeeDatabase = require('./lib/EmployeeDatabase');

const options = [
    "View Deparments", 
    "View Roles", 
    "View Employees",
    "Add Department",
    "Add Role",
    "Add Employee",
    "Update Employee Role",
    "Quit",
];


const db = new EmployeeDatabase();

doMainPrompt();


async function doMainPrompt() {

    answers = await inquirer.prompt([
        {
        type: "list",
        message: "What are we doing?",
        name: "option",
        choices: options
        }
    ]);
        
    switch(answers.choice) {
        case options[0]:
            viewDepartments();
            break;

        case options[1]:
            viewRoles();
            break;
        
        case options[2]:
            viewEmployees();
            break;

        case options[3]:
            addDepartment();
            break;

        case options[4]:
            addRole();
            break;

        case options[5]:
            addEmployee();
            break;

        case options[6]:
            updateEmployeeRole();
            break;

        case options[7]:
            await db.close();
            process.exit();
        }
}