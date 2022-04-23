const inquirer = require("inquirer")
const cTable = require('console.table');
const EmployeeDatabase = require('./lib/EmployeeDatabase.js');

const options = [
    "View all Deparments", 
    "View All Jobs", 
    "View All Employees",
    "Add Department",
    "Add Job",
    "Add Employee",
    "Update Employee Job",
    "Quit",
];

const db = new EmployeeDatabase();

doMainPrompt();

async function doMainPrompt() {

    answers = await inquirer.prompt([
        {
        type: "list",
        message: "whats your choice?",
        name: "choice",
        choices: options
        }
    ]);
        
    switch(answers.choice) {
        case options[0]:
            viewDepartments();
            break;

        case options[1]:
            viewJobs();
            break;
        
        case options[2]:
            viewEmployees();
            break;

        case options[3]:
            addDepartment();
            break;

        case options[4]:
            addJob();
            break;

        case options[5]:
            addEmployee();
            break;

        case options[6]:
            updateEmployeeJob();
            break;

        case options[7]:
            await db.close();
            process.exit();
        }
}

async function viewDepartments() {
    const sql = "SELECT * FROM  department";
    res = await db.query(sql);
    console.log("\nDepartments");
    console.table(res);
    doMainPrompt();
}

async function viewJobs() {
    const sql = "SELECT job.id, job.title, job.salary, department.name AS department_name FROM job INNER JOIN department ON job.department_id=department.id";
    res = await db.query(sql);
    console.log("\nJobs");
    console.table(res);
    doMainPrompt();
}

async function viewEmployees() {
    const sql = "select emp.id, emp.first_name, emp.last_name, role.title as job_title, department.name as department_name, role.salary as salary, emp.manager_id from employee as emp inner join job on emp.job_id=job.id inner join department on job.department_id=department.id";
    res = await db.query(sql);
    console.log("\nEmployees");
    console.table(res);
    doMainPrompt();
}

async function addDepartment() {
    const answers = await inquirer.prompt([
        {
          name: "name",
          type: "input",
          message: "whats the department name:",
          validate: (name) => { return name != "" }
        }
    ]);
    const sql = "INSERT INTO department SET ?";
    await db.query(sql,
        {
            name: answers.name
        }
    );
    console.log("\nAdded department " + answers.name + " to the database\n");
    doMainPrompt();
}

async function addJob() {

    const departments = await db.query(`SELECT id, name FROM department`);
    const dept_list = departments.map(function (el) { return el.name; });

    const answers = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter Job:",
            validate: (name) => { return name != "" }
        },
        {
            name: "salary",
            type: "input",
            message: "Enter salary:",
            validate(answer) {
                salaryRegex = /^[$]?\d[\d,]*$/
                if(!salaryRegex.test(answer)) {
                    return "Not valid!";
                }
                return true;
            }   
        },
        {
            name: "choice",
            type: "list",
            message: "choose department:",
            choices: dept_list
        }
    ]);
    const sql = "INSERT INTO job SET ?";
    await db.query(sql,
        {
            title: answers.name,
            salary: parseFloat(answers.salary),
            department_id : getRecordId(departments, "name", answers.choice)
        }
    );
    console.log("\nAdded job " + answers.name + " to the database\n");
    doMainPrompt();
}

async function addEmployee() {

    const jobs = await db.query(`SELECT id, title FROM jobs`);
    const job_list = jobs.map(function (el) { return el.title; });

    const employees = await db.query(`SELECT id, concat(first_name, " ", last_name) as name FROM employee`)
    var employee_list = employees.map(function (el) { return el.name; });
    employee_list.push("None");
     
    const answers = await inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "employee first name:",
            validate: (firstname) => { return firstname != "" }
        },
        {
            name: "lastname",
            type: "input",
            message: "last name of employee:",
            validate: (lastname) => { return lastname != "" }
        },
        {
            type: "list",
            message: "select job for employee:",
            name: "remployee_job",
            choices: job_list
        },
        {
            type: "list",
            message: "select manager for employee:",
            name: "choose_manager",
            choices: employee_list
        }
    ]);
    
    const sql = "INSERT INTO employee SET ?";

    let manager_id = null;
    if (answers.manager_choice != "None") {
        manager_id = getRecordId(employees, "name", answers.manager_choice);
    }      
                
    await db.query(sql,
        {
            first_name: answers.firstname,
            last_name: answers.lastname,
            role_id : getRecordId(jobs, "title", answers.job_choice),
            manager_id : manager_id
        }
    );
    console.log("\nAdded Employee " + answers.first_name +  " " + answers.last_name + " to the database\n");
    doMainPrompt();
}

async function updateEmployeeJob() {

    const jobs = await db.query(`SELECT id, title FROM jobs`);
    const job_list = jobs.map(function (el) { return el.title; });

    const employees = await db.query(`SELECT id, concat(first_name, " ", last_name) as name FROM employee`);
    const employee_list = employees.map(function (el) { return el.name; });
     
    const answers = await inquirer.prompt([
        {
            type: "list",
            message: "choose employees:",
            name: "choose_employee",
            choices: employee_list
        },
        {
            type: "list",
            message: "choose new job:",
            name: "choose_job",
            choices: job_list
        }
    ]);

    const sql = "UPDATE employee SET job_id=? WHERE id=?";
          
    await db.query(sql,
        [
            getRecordId(jobs, "title", answers.job_choice),
            getRecordId(employees, "name", answers.employee_choice)
        ]
    );
    console.log("\nUpdated Employee " + answers.employee_choice +  " with Job " + answers.job_choice + "\n");
    doMainPrompt();
}


function getRecordId(object_array, search_key, search_val) {

    record_id = null;

    for(let i=0; i<object_array.length; i++) {
        if (object_array[i][search_key] === search_val) {
            record_id = object_array[i].id;
            break;
        }
    }

    return record_id;
}