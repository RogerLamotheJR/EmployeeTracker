-- CREATE TABLE "department" -----------------------------------
CREATE TABLE `department` ( 
	`id` Int( 255 ) AUTO_INCREMENT NOT NULL,
	`name` VarChar( 30 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `unique_id` UNIQUE( `id` ) )
CHARACTER SET = utf8
COLLATE = utf8_general_ci
ENGINE = InnoDB
AUTO_INCREMENT = 6;
-- -------------------------------------------------------------


-- CREATE TABLE "employee" -------------------------------------
CREATE TABLE `employee` ( 
	`first_name` VarChar( 30 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
	`last_name` VarChar( 30 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
	`role_id` Int( 255 ) NOT NULL,
	`manager_id` Int( 255 ) NULL,
	`id` Int( 255 ) AUTO_INCREMENT NOT NULL,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `unique_id` UNIQUE( `id` ) )
CHARACTER SET = utf8
COLLATE = utf8_general_ci
ENGINE = InnoDB
AUTO_INCREMENT = 8;
-- -------------------------------------------------------------


-- CREATE TABLE "role" -----------------------------------------
CREATE TABLE `role` ( 
	`id` Int( 255 ) AUTO_INCREMENT NOT NULL,
	`title` VarChar( 30 ) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
	`salary` Decimal( 10, 0 ) NOT NULL,
	`department_id` Int( 255 ) NOT NULL,
	PRIMARY KEY ( `id` ),
	CONSTRAINT `unique_id` UNIQUE( `id` ) )
CHARACTER SET = utf8
COLLATE = utf8_general_ci
ENGINE = InnoDB
AUTO_INCREMENT = 8;
-- -------------------------------------------------------------


-- Dump data of "department" -------------------------------
BEGIN;

INSERT INTO `department`(`id`,`name`) VALUES ( '1', 'Sales' );
INSERT INTO `department`(`id`,`name`) VALUES ( '2', 'Engineering' );
INSERT INTO `department`(`id`,`name`) VALUES ( '3', 'Finance' );
INSERT INTO `department`(`id`,`name`) VALUES ( '4', 'Legal' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "employee" ---------------------------------
BEGIN;

INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Leanne', 'Graham', '1', '1', '1' );
INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Ervin', 'Howell', '3', '3', '2' );
INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Clementine', 'Bauch', '2', NULL, '3' );
INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Patricia', 'Lebsack', '5', '3', '4' );
INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Chelsey', 'Dietrich', '3', NULL, '5' );
INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Dennis', 'Schulist', '4', '7', '6' );
INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Kurtis', 'Weissnat', '7', NULL, '7' );
INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Nicholas', 'Runolfsdottir', '5', '5', '8' );
INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Glenna', 'Reichert', '2', '4', '9' );
INSERT INTO `employee`(`first_name`,`last_name`,`role_id`,`manager_id`,`id`) VALUES ( 'Klaire', 'DuBuque', '5', '4', '10' );
COMMIT;
-- ---------------------------------------------------------


-- Dump data of "role" -------------------------------------
BEGIN;

INSERT INTO `role`(`id`,`title`,`salary`,`department_id`) VALUES ( '1', 'Sales Lead', '100000', '1' );
INSERT INTO `role`(`id`,`title`,`salary`,`department_id`) VALUES ( '2', 'Salesperson', '80000', '1' );
INSERT INTO `role`(`id`,`title`,`salary`,`department_id`) VALUES ( '3', 'Lead Engineer', '150000', '2' );
INSERT INTO `role`(`id`,`title`,`salary`,`department_id`) VALUES ( '4', 'Software Engineer', '120000', '2' );
INSERT INTO `role`(`id`,`title`,`salary`,`department_id`) VALUES ( '5', 'Accountant', '125000', '3' );
INSERT INTO `role`(`id`,`title`,`salary`,`department_id`) VALUES ( '6', 'Legal Team Lead', '250000', '4' );
INSERT INTO `role`(`id`,`title`,`salary`,`department_id`) VALUES ( '7', 'Lawyer', '190000', '4' );
COMMIT;
-- ---------------------------------------------------------


-- CREATE INDEX "role_employee" --------------------------------
CREATE INDEX `role_employee` USING BTREE ON `employee`( `role_id` );
-- -------------------------------------------------------------


-- CREATE INDEX "department_role" ------------------------------
CREATE INDEX `department_role` USING BTREE ON `role`( `department_id` );
-- -------------------------------------------------------------


-- CREATE LINK "role_employee" ---------------------------------
ALTER TABLE `employee`
	ADD CONSTRAINT `role_employee` FOREIGN KEY ( `role_id` )
	REFERENCES `role`( `id` )
	ON DELETE No Action
	ON UPDATE No Action;
-- -------------------------------------------------------------


-- CREATE LINK "department_role" -------------------------------
ALTER TABLE `role`
	ADD CONSTRAINT `department_role` FOREIGN KEY ( `department_id` )
	REFERENCES `department`( `id` )
	ON DELETE No Action
	ON UPDATE No Action;
-- -------------------------------------------------------------


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
-- ---------------------------------------------------------


