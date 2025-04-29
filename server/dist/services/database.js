"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
exports.getAllStudents = getAllStudents;
exports.getStudentByName = getStudentByName;
exports.getAllRSOS = getAllRSOS;
exports.getRSOByName = getRSOByName;
exports.addStudent = addStudent;
exports.deleteStudent = deleteStudent;
exports.addRSO = addRSO;
exports.deleteRSO = deleteRSO;
exports.updateStudentInterests = updateStudentInterests;
const connection_1 = __importDefault(require("./connection"));
const deletea_triggers_1 = require("../migrations/deletea_triggers");
const prevent_duplicates_1 = require("../migrations/prevent_duplicates");
function initializeDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield connection_1.default.getConnection();
        try {
            console.log('Initializing database...');
            // Clean up all existing triggers first
            yield (0, deletea_triggers_1.cleanupTriggers)(connection);
            // Only reinitialize the duplicate prevention trigger
            yield (0, prevent_duplicates_1.up)(connection);
            console.log('Database initialized successfully');
        }
        catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
        finally {
            connection.release();
        }
    });
}
function getAllStudents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield connection_1.default.query('SELECT * FROM Students');
            return rows;
        }
        catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    });
}
function getStudentByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield connection_1.default.query('SELECT * FROM Students WHERE name LIKE ?', [`%${name}%`]);
            return rows;
        }
        catch (error) {
            console.error('Error searching for student:', error);
            throw error;
        }
    });
}
function getAllRSOS() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield connection_1.default.query('SELECT * FROM RSO_Interests');
            return rows;
        }
        catch (error) {
            console.error('Error fetching RSOs:', error);
            throw error;
        }
    });
}
function getRSOByName(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [rows] = yield connection_1.default.query('SELECT * FROM RSO_Interests WHERE RSOname LIKE ?', [`%${name}%`]);
            return rows;
        }
        catch (error) {
            console.error('Error searching for RSO:', error);
            throw error;
        }
    });
}
function addStudent(newStudent, interests) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield connection_1.default.getConnection();
        try {
            yield connection.beginTransaction();
            yield connection.query('INSERT INTO Students (netId, name, year, minor, major, taggedPref, prefTimeComm) VALUES (?, ?, ?, ?, ?, ?, ?)', [newStudent.netId, newStudent.name, newStudent.year, newStudent.minor, newStudent.major,
                newStudent.taggedPref, newStudent.prefTimeComm]);
            yield connection.query('INSERT INTO Student_Interests (netId, interest1, interest2, interest3) VALUES (?, ?, ?, ?)', [newStudent.netId, interests.interest1, interests.interest2, interests.interest3]);
            yield connection.commit();
        }
        catch (error) {
            yield connection.rollback();
            if (error.message.includes('Account already exists under this netID')) {
                throw new Error('Account already exists under this netID');
            }
            console.error('Error adding student:', error);
            throw error;
        }
        finally {
            connection.release();
        }
    });
}
function deleteStudent(studentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield connection_1.default.getConnection();
        try {
            yield connection.beginTransaction();
            console.log(`Attempting to delete student: ${studentId}`);
            // Delete from Roster first
            const [rosterResult] = yield connection.query('DELETE FROM Roster WHERE netId = ?', [studentId]);
            console.log('Deleted from Roster');
            // Delete from Student_Interests
            const [interestsResult] = yield connection.query('DELETE FROM Student_Interests WHERE netId = ?', [studentId]);
            console.log('Deleted from Student_Interests');
            // Finally delete from Students
            const [studentResult] = yield connection.query('DELETE FROM Students WHERE netId = ?', [studentId]);
            console.log('Deleted from Students');
            yield connection.commit();
            console.log(`Successfully deleted student with netId: ${studentId}`);
        }
        catch (error) {
            yield connection.rollback();
            console.error('Error deleting student:', error);
            throw error;
        }
        finally {
            connection.release();
        }
    });
}
function addRSO(newRSO, interests) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield connection_1.default.getConnection();
        try {
            yield connection.beginTransaction();
            yield connection.query('INSERT INTO RSOs (RSOName, department, expTimeComm, taggedPref) VALUES (?, ?, ?, ?)', [newRSO.RSOName, newRSO.department, newRSO.expTimeComm, newRSO.taggedPref]);
            yield connection.query('INSERT INTO RSO_Interests (RSOname, RSOInterest1, RSOInterest2, RSOInterest3) VALUES (?, ?, ?, ?)', [newRSO.RSOName, interests.interest1, interests.interest2, interests.interest3]);
            yield connection.commit();
        }
        catch (error) {
            yield connection.rollback();
            console.error('Error adding RSO:', error);
            throw error;
        }
        finally {
            connection.release();
        }
    });
}
function deleteRSO(rsoName) {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield connection_1.default.getConnection();
        try {
            yield connection.beginTransaction();
            yield connection.query('DELETE FROM RSO_Interests WHERE RSOname = ?', [rsoName]);
            yield connection.query('DELETE FROM RSOs WHERE RSOName = ?', [rsoName]);
            yield connection.commit();
        }
        catch (error) {
            yield connection.rollback();
            console.error('Error deleting RSO:', error);
            throw error;
        }
        finally {
            connection.release();
        }
    });
}
function updateStudentInterests(netId, newInterests) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection_1.default.query('UPDATE Student_Interests SET interest1 = ?, interest2 = ?, interest3 = ? WHERE netId = ?', [
                newInterests.interest1 || 'NA',
                newInterests.interest2 || 'NA',
                newInterests.interest3 || 'NA',
                netId
            ]);
        }
        catch (error) {
            console.error('Error updating student interests:', error);
            throw error;
        }
    });
}
