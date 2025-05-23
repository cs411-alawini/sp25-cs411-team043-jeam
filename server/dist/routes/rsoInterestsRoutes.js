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
const express_1 = __importDefault(require("express"));
const connection_1 = __importDefault(require("../services/connection"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.search) {
            const [rows] = yield connection_1.default.query(`SELECT ri.* FROM RSO_Interests ri 
         JOIN RSOs r ON ri.RSOname = r.RSOName 
         WHERE ri.RSOname LIKE ?`, [`%${req.query.search}%`]);
            res.json(rows);
        }
        else {
            const [rows] = yield connection_1.default.query('SELECT * FROM RSO_Interests');
            res.json(rows);
        }
    }
    catch (error) {
        console.error('Error fetching RSOs:', error);
        res.status(500).json({ error: 'Failed to fetch RSOs' });
    }
}));
exports.default = router;
