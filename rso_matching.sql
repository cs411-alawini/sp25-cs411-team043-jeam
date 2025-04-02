USE rso_matching_database;

CREATE TABLE Students (
    netId VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    year INT,
    minor VARCHAR(50),
    major VARCHAR(50),
    taggedPref VARCHAR(50),
    prefTimeComm VARCHAR(100)
);

CREATE TABLE Student_Interests (
    studentInterestId VARCHAR(50) PRIMARY KEY,
    netId VARCHAR(50),
    interest1 VARCHAR(100),
    interest2 VARCHAR(100),
    interest3 VARCHAR(100),
    FOREIGN KEY (netId) REFERENCES Students(netId)
);

CREATE TABLE Departments (
    departmentName VARCHAR(50) PRIMARY KEY,
    mainOfficeLocation VARCHAR(100),
    numberOfStudents INT
);

CREATE TABLE RSOs (
    RSOName VARCHAR(100) PRIMARY KEY,
    department VARCHAR(100),
    expTimeComm VARCHAR(100),
    taggedPref VARCHAR(50),
    FOREIGN KEY (department) REFERENCES Departments(departmentName)
);

CREATE TABLE Roster (
    netId VARCHAR(50),
    RSO_name VARCHAR(100),
    PRIMARY KEY (netId, RSO_name),
    FOREIGN KEY (netId) REFERENCES Students(netId),
    FOREIGN KEY (RSO_name) REFERENCES RSOs(RSOName)
);

CREATE TABLE RSO_Interests (
    RSOInterestId VARCHAR(50) PRIMARY KEY,
    RSOname VARCHAR(100),
    RSOInterest1 VARCHAR(100),
    RSOInterest2 VARCHAR(100),
    RSOInterest3 VARCHAR(100),
    FOREIGN KEY (RSOname) REFERENCES RSOs(RSOName)
);

