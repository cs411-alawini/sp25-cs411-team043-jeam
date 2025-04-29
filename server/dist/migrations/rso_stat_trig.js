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
        try {
            // Drop existing triggers if they exist
            yield connection.query('DROP TRIGGER IF EXISTS after_roster_insert');
            yield connection.query('DROP TRIGGER IF EXISTS after_roster_delete');
            // Create or update RSO_Stats table
            yield connection.query(`
      CREATE TABLE IF NOT EXISTS RSO_Stats (
        RSO_name VARCHAR(100) PRIMARY KEY,
        total_members INT DEFAULT 0,
        FOREIGN KEY (RSO_name) REFERENCES RSOs(RSOName)
      );
    `);
            // Initialize RSO_Stats with current data
            yield connection.query(`
      INSERT INTO RSO_Stats (RSO_name, total_members)
      SELECT r.RSO_name, COUNT(r.netId) as total_members
      FROM Roster r
      GROUP BY r.RSO_name
      ON DUPLICATE KEY UPDATE total_members = VALUES(total_members);
    `);
            // Create new triggers
            yield connection.query(`
      CREATE TRIGGER after_roster_insert
      AFTER INSERT ON Roster
      FOR EACH ROW
      BEGIN
        INSERT INTO RSO_Stats (RSO_name, total_members)
        SELECT NEW.RSO_name, COUNT(netId)
        FROM Roster
        WHERE RSO_name = NEW.RSO_name
        ON DUPLICATE KEY UPDATE total_members = VALUES(total_members);
      END;
    `);
            yield connection.query(`
      CREATE TRIGGER after_roster_delete
      AFTER DELETE ON Roster
      FOR EACH ROW
      BEGIN
        UPDATE RSO_Stats
        SET total_members = (
          SELECT COUNT(netId)
          FROM Roster
          WHERE RSO_name = OLD.RSO_name
        )
        WHERE RSO_name = OLD.RSO_name;
      END;
    `);
        }
        catch (error) {
            console.error('Error setting up RSO stats:', error);
            throw error;
        }
    });
}
