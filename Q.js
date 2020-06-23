const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const dbconfig = require('./dbconfig');

module.exports = class Q {
  static getAllEmployees(cb) {
    const conn = mysql.createConnection(dbconfig);
    conn.connect();

    const queryString =
      "select employee.id, employee.first_name, employee.last_name, role.title as title, department.name as department, role.salary as salary, case when manager.id is not null then concat_ws(' ', manager.first_name, manager.last_name) else null end as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on employee.manager_id = manager.id";

    conn.query(queryString, function(error, results) {
      if (error) throw error;
      console.log(cTable.getTable(results));
      cb();
    });
    conn.end();
  }

  static getAllEmployeesByDepartment(cb) {
    const conn = mysql.createConnection(dbconfig);
    conn.connect();
    const queryDepartments = 'select name, id as value from department';
    const queryEmployeesByDepartments =
      "select employee.id, employee.first_name, employee.last_name, role.title as title, department.name as department, role.salary as salary, case when manager.id is not null then concat_ws(' ', manager.first_name, manager.last_name) else null end as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on employee.manager_id = manager.id where department.id = ?";

    conn.query(queryDepartments, (err, departments) => {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'depId',
            message: 'Select a department',
            choices: departments,
          },
        ])
        .then(res => {
          conn.query(queryEmployeesByDepartments, [res.depId], (err, results) => {
            console.table(results);
            cb();
            conn.end();
          });
        });
    });
  }

  static getAllEmployeesByManager(cb) {
    const conn = mysql.createConnection(dbconfig);
    conn.connect();
    const queryManagers =
      "select CONCAT_WS(' ', manager.first_name, manager.last_name) as name, id as value from employee as manager where id in (select distinct(manager_id) manager_id from employee where manager_id is not null)";
    const queryEmployeesByManager =
      "select employee.id, employee.first_name, employee.last_name, role.title as title, department.name as department, role.salary as salary, case when manager.id is not null then concat_ws(' ', manager.first_name, manager.last_name) else null end as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on employee.manager_id = manager.id where employee.manager_id = ?";

    conn.query(queryManagers, (err, managers) => {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'mId',
            message: 'Select a manager',
            choices: managers,
          },
        ])
        .then(res => {
          conn.query(queryEmployeesByManager, [res.mId], (err, results) => {
            console.table(results);
            cb();
            conn.end();
          });
        });
    });
  }

  static addEmployee(cb) {
    const validateName = name => {
      return name !== '' ? true : 'Please enter valid name.';
    };
    const validateLastName = name => {
      return name !== '' ? true : 'Please enter valid last name.';
    };

    const conn = mysql.createConnection(dbconfig);
    conn.connect();
    const queryAllEmployees =
      "select CONCAT_WS(' ', employee.first_name, employee.last_name) as name, id as value from employee";
    const queryAllRoles = 'select title as name, id as value from role';
    const queryNewEmployee = 'INSERT INTO employee SET ?';

    conn.query(queryAllEmployees, (err, employees) => {
      conn.query(queryAllRoles, (err, roles) => {
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'first_name',
              message: 'Enter Employee first name',
              validate: validateName,
            },
            {
              type: 'input',
              name: 'last_name',
              message: 'Enter Employee last name',
              validate: validateLastName,
            },
            {
              type: 'list',
              name: 'role_id',
              message: 'Select Employee role',
              choices: roles,
            },
            {
              type: 'list',
              name: 'manager_id',
              message: 'Select Employee manager',
              choices: employees,
            },
          ])
          .then(res => {
            conn.query(queryNewEmployee, res, err => {
              if (err) console.error(err);
              cb();
              conn.end();
            });
          });
      });
    });
  }
  static removeEmployee(cb) {
    const conn = mysql.createConnection(dbconfig);
    conn.connect();

    const queryAllEmployees =
      "select CONCAT_WS(' ', employee.first_name, employee.last_name) as name, id as value from employee";
    const queryDeleteEmployee = 'DELETE FROM employee WHERE id = ?';
    const querySetManagerNull = 'UPDATE employee set manager_id = null where manager_id = ?';

    conn.query(queryAllEmployees, (err, employees) => {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'id',
            message: 'Select Employee to remove',
            choices: employees,
          },
        ])
        .then(employee => {
          inquirer
            .prompt([
              {
                type: 'confirm',
                name: 'confirm',
                message: 'Are you sure you want to remove this employee?',
              },
            ])
            .then(res => {
              if (res.confirm) {
                conn.query(querySetManagerNull, employee.id, err => {
                  if (err) console.error(err);
                  conn.query(queryDeleteEmployee, employee.id, err => {
                    if (err) console.error(err);
                    console.log('Employee removed');
                    cb();
                    conn.end();
                  });
                });
              } else {
                cb();
              }
            });
        });
    });
  }

  static updateEmployeeRole(cb) {
    const conn = mysql.createConnection(dbconfig);
    conn.connect();
    const queryAllEmployees =
      "select CONCAT_WS(' ', employee.first_name, employee.last_name) as name, id as value from employee";
    const queryAllRoles = 'select title as name, id as value from role';
    const queryUpdateEmployeeRole = 'UPDATE employee set role_id = ? where id = ?';

    conn.query(queryAllEmployees, (err, employees) => {
      conn.query(queryAllRoles, (err, roles) => {
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'id',
              message: 'Select Employee',
              choices: employees,
            },
            {
              type: 'list',
              name: 'role',
              message: 'Select new role',
              choices: roles,
            },
          ])
          .then(res => {
            conn.query(queryUpdateEmployeeRole, [res.role, res.id], err => {
              if (err) console.error(err);
              cb();
              conn.end();
            });
          });
      });
    });
  }
  static updateEmployeeManager(cb) {
    const conn = mysql.createConnection(dbconfig);
    conn.connect();
    const queryAllEmployees =
      "select CONCAT_WS(' ', employee.first_name, employee.last_name) as name, id as value from employee";
    const queryAllManagers =
      "select CONCAT_WS(' ', employee.first_name, employee.last_name) as name, id as value from employee where id <> ?";
    const queryUpdateEmployeeRole = 'UPDATE employee set manager_id = ? where id = ?';

    conn.query(queryAllEmployees, (err, employees) => {
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'id',
            message: 'Select Employee',
            choices: employees,
          },
        ])
        .then(employee => {
          conn.query(queryAllManagers, [employee.id], (err, manager) => {
            inquirer
              .prompt([
                {
                  type: 'list',
                  name: 'manager',
                  message: 'Select manager',
                  choices: manager,
                },
              ])
              .then(res => {
                conn.query(queryUpdateEmployeeRole, [res.manager, employee.id], err => {
                  if (err) console.error(err);
                  console.log('Manager updated');
                  cb();
                  conn.end();
                });
              });
          });
        });
    });
  }
  static addDepartment(cb) {
    const validateName = name => {
      return name !== '' ? true : 'Please enter valid name.';
    };
    const conn = mysql.createConnection(dbconfig);
    conn.connect();
    const queryAddDepartment = 'INSERT INTO department SET ?';

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'Enter department name',
          validate: validateName,
        },
      ])
      .then(res => {
        conn.query(queryAddDepartment, res, err => {
          if (err) console.error(err);
          cb();
        });
      });
  }
  static addRole(cb) {
    const validateName = name => {
      return name !== '' ? true : 'Please enter valid name.';
    };
    const validateNumber = number => {
      return number.match(/^[1-9]\d*/) ? true : 'Please enter valid number.';
    };
    const conn = mysql.createConnection(dbconfig);
    conn.connect();
    const queryDepartments = 'select name, id as value from department';
    const queryAddRole = 'INSERT INTO role SET ?';

    conn.query(queryDepartments, (err, departments) => {
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Enter role title',
            validate: validateName,
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter role salary',
            validate: validateNumber,
          },
          {
            type: 'list',
            name: 'department_id',
            message: 'Select a department',
            choices: departments,
          },
        ])
        .then(res => {
          conn.query(queryAddRole, res, err => {
            if (err) console.error(err);
            cb();
          });
        });
    });
  }

  static getAllDepartments(cb) {
    const conn = mysql.createConnection(dbconfig);
    conn.connect();

    const queryString = 'select * from department';

    conn.query(queryString, function(error, results) {
      if (error) throw error;
      console.table(results);
      cb();
    });
    conn.end();
  }

  static getAllRoles(cb) {
    const conn = mysql.createConnection(dbconfig);
    conn.connect();

    const queryString =
      'select role.id, role.title, role.salary, department.name as department from role left join department on role.department_id = department.id';

    conn.query(queryString, function(error, results) {
      if (error) throw error;
      console.table(results);
      cb();
    });
    conn.end();
  }

  static getDepartmentsBudget(cb) {
    const conn = mysql.createConnection(dbconfig);
    conn.connect();

    const queryString =
      'select department.name as department, sum(role.salary * (select count(employee.id) from employee where employee.role_id = role.id)) as budget from role left join department on role.department_id = department.id group by department_id';
    conn.query(queryString, function(error, results) {
      if (error) throw error;
      console.table(results);
      cb();
    });
    conn.end();
  }
};
