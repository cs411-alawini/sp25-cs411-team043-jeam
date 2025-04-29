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
            // Drop all RSO stats related triggers
            yield connection.query('DROP TRIGGER IF EXISTS after_roster_insert');
            yield connection.query('DROP TRIGGER IF EXISTS after_roster_delete');
            yield connection.query('DROP TRIGGER IF EXISTS after_roster_insert_count');
            yield connection.query('DROP TRIGGER IF EXISTS after_roster_delete_count');
            // Drop the stats tables
            yield connection.query('DROP TABLE IF EXISTS RSO_Stats');
            yield connection.query('DROP TABLE IF EXISTS RSO_Member_Count');
            console.log('Successfully dropped RSO stats triggers and tables');
        }
        catch (error) {
            console.error('Error dropping triggers:', error);
            throw error;
        }
    });
}
