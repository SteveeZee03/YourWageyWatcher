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