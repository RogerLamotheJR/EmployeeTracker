const inquirer = require('inquirer');

const Q = require('./Q');

function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'option',
        message: 'What to do?',
        choices: [
          { name: 'View All Employees', value: 1 },
          { name: 'View All Employees By Department', value: 2 },
          { name: 'View All Employees By Manager', value: 3 },
          { name: 'Add Employee', value: 4 },
          { name: 'Remove Employee', value: 5 },
          { name: 'Update Employee Role', value: 6 },
          { name: 'Update Employee Manager', value: 7 },
          { name: 'View All Departments', value: 8 },
          { name: 'Add Department', value: 9 },
          { name: 'View All Roles', value: 10 },
          { name: 'Add Role', value: 11 },
          { name: 'View All Departments Budget', value: 12 },
        ],
      },
    ])
    .then(res => {
      switch (res.option) {
        case 1:
          Q.getAllEmployees(mainMenu);
          break;
        case 2:
          Q.getAllEmployeesByDepartment(mainMenu);
          break;
        case 3:
          Q.getAllEmployeesByManager(mainMenu);
          break;
        case 4:
          Q.addEmployee(mainMenu);
          break;
        case 5:
          Q.removeEmployee(mainMenu);
          break;
        case 6:
          Q.updateEmployeeRole(mainMenu);
          break;
        case 7:
          Q.updateEmployeeManager(mainMenu);
          break;
        case 8:
          Q.getAllDepartments(mainMenu);
          break;
        case 9:
          Q.addDepartment(mainMenu);
          break;
        case 10:
          Q.getAllRoles(mainMenu);
          break;
        case 11:
          Q.addRole(mainMenu);
          break;
        case 12:
          Q.getDepartmentsBudget(mainMenu);
          break;
        default:
          mainMenu();
          break;
      }
    });
}
mainMenu();
