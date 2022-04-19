USE employee_db;

INSERT INTO department (name) 
    VALUES 
        ("floor"),
        ("paint");


INSERT INTO job (title, salary, department_id)
    VALUES 
        ("service desk", 25000.00, 1),
        ("paint specalist", 25000.00, 2),
        ("floor manager", 75000.00, 1),
        ("paint boss", 100000.00, 2);

        INSERT INTO employee (first_name, last_name, job_id, manager_id) 
    VALUES
        ("harry", "potter", 3, NULL),
        ("ron", "weasly", 4, NULL);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES
        ("draco", "malfoy", 1, 1),
        ("hermonie", "granger", 2, 2);