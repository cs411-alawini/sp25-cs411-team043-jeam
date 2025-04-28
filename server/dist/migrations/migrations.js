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
        // Create RSO_Stats table
        yield connection.query(`
    CREATE TABLE IF NOT EXISTS RSO_Stats (
      RSO_name VARCHAR(255) PRIMARY KEY,
      total_members INT DEFAULT 0,
      FOREIGN KEY (RSO_name) REFERENCES RSOs(RSOName)
    );
  `);
        // Add status column to RSOs if it doesn't exist
        yield connection.query(`
    ALTER TABLE RSOs
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';
  `);
        // Create triggers
        yield connection.query(`DROP TRIGGER IF EXISTS after_roster_insert`);
        yield connection.query(`DROP TRIGGER IF EXISTS after_roster_delete`);
        yield connection.query(`
    CREATE TRIGGER after_roster_insert
    AFTER INSERT ON Roster
    FOR EACH ROW
    BEGIN
        INSERT INTO RSO_Stats (RSO_name, total_members)
        VALUES (NEW.RSO_name, 1)
        ON DUPLICATE KEY UPDATE
        total_members = total_members + 1;
        
        IF (SELECT total_members FROM RSO_Stats WHERE RSO_name = NEW.RSO_name) >= 100 THEN
            UPDATE RSOs 
            SET status = 'Full'
            WHERE RSOName = NEW.RSO_name;
        END IF;
    END
  `);
        yield connection.query(`
    CREATE TRIGGER after_roster_delete
    AFTER DELETE ON Roster
    FOR EACH ROW
    BEGIN
        UPDATE RSO_Stats
        SET total_members = total_members - 1
        WHERE RSO_name = OLD.RSO_name;
        
        IF (SELECT total_members FROM RSO_Stats WHERE RSO_name = OLD.RSO_name) < 100 THEN
            UPDATE RSOs 
            SET status = 'Active'
            WHERE RSOName = OLD.RSO_name;
        END IF;
    END
  `);
    });
}
