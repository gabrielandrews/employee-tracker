USE employee_db;

INSERT INTO department (name) 
    VALUES 
        ("floor"),
        ("paint");


INSERT INTO role (title, salary, department_id)
    VALUES 
        ("service desk", 25000.00, 1),
        ("paint specalist", 25000.00, 2),
        ("floor manager", 75000.00, 1),
        ("paint boss", 100000.00, 2);