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
exports.cleanupTriggers = cleanupTriggers;
function cleanupTriggers(connection) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting trigger cleanup...');
            // Drop specific known triggers first
            const knownTriggers = [
                'after_roster_insert',
                'after_roster_delete',
                'after_roster_insert_count',
                'after_roster_delete_count',
                'roster_update_stats',
                'roster_delete_stats',
                'member_count_update'
            ];
            for (const trigger of knownTriggers) {
                yield connection.query(`DROP TRIGGER IF EXISTS ${trigger}`);
                console.log(`Explicitly dropped trigger: ${trigger}`);
            }
            // Get and drop all remaining triggers
            const [triggers] = yield connection.query(`
      SELECT TRIGGER_NAME, EVENT_OBJECT_TABLE
      FROM information_schema.TRIGGERS 
      WHERE TRIGGER_SCHEMA = DATABASE()
    `);
            for (const trigger of triggers) {
                yield connection.query(`DROP TRIGGER IF EXISTS ${trigger.TRIGGER_NAME}`);
                console.log(`Dropped trigger: ${trigger.TRIGGER_NAME}`);
            }
            // Drop all stats-related tables
            yield connection.query('DROP TABLE IF EXISTS RSO_Stats');
            yield connection.query('DROP TABLE IF EXISTS RSO_Member_Count');
            yield connection.query('DROP TABLE IF EXISTS RSO_Statistics');
            console.log('Dropped statistics tables');
            // Verify no triggers remain
            const [remainingTriggers] = yield connection.query(`
      SELECT COUNT(*) as count
      FROM information_schema.TRIGGERS 
      WHERE TRIGGER_SCHEMA = DATABASE()
    `);
            console.log('Remaining triggers count:', remainingTriggers[0].count);
        }
        catch (error) {
            console.error('Error cleaning up triggers:', error);
            throw error;
        }
    });
}
