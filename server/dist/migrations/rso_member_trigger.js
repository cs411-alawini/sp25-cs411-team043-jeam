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
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
function up(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        // Create RSO_Member_Count table
        yield connection.query(`
    CREATE TABLE IF NOT EXISTS RSO_Member_Count (
      RSO_name VARCHAR(100) PRIMARY KEY,
      member_count INT DEFAULT 0,
      FOREIGN KEY (RSO_name) REFERENCES RSOs(RSOName)
    );
  `);
        // Initialize the member count table
        yield connection.query(`
    INSERT INTO RSO_Member_Count (RSO_name, member_count)
    SELECT r.RSO_name, COUNT(r.netId) as member_count
    FROM Roster r
    GROUP BY r.RSO_name
    ON DUPLICATE KEY UPDATE member_count = VALUES(member_count);
  `);
        // Create trigger for new members
        yield connection.query(`
    CREATE TRIGGER IF NOT EXISTS after_roster_insert_count
    AFTER INSERT ON Roster
    FOR EACH ROW
    BEGIN
      INSERT INTO RSO_Member_Count (RSO_name, member_count)
      SELECT NEW.RSO_name, COUNT(netId)
      FROM Roster
      WHERE RSO_name = NEW.RSO_name
      ON DUPLICATE KEY UPDATE member_count = VALUES(member_count);
    END;
  `);
        // Create trigger for removed members
        yield connection.query(`
    CREATE TRIGGER IF NOT EXISTS after_roster_delete_count
    AFTER DELETE ON Roster
    FOR EACH ROW
    BEGIN
      UPDATE RSO_Member_Count
      SET member_count = (
        SELECT COUNT(netId)
        FROM Roster
        WHERE RSO_name = OLD.RSO_name
      )
      WHERE RSO_name = OLD.RSO_name;
    END;
  `);
    });
}
