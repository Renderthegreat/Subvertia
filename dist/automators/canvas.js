"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const automator_1 = require("~/automator");
const axios_1 = __importDefault(require("axios"));
const Cheerio = __importStar(require("cheerio"));
class Canvas extends automator_1.Automator {
    constructor() {
        super();
    }
    ;
    async ready() {
        const courses = (await axios_1.default.get(`${this.auth.canvas_url}/api/v1/courses?enrollment_state=all`, {
            headers: {
                'Authorization': `Bearer ${this.auth.canvas_token}`
            }
        })).data.map((v) => {
            return {
                id: v.id,
                name: v.name,
                assignments: []
            };
        });
        for (const course of courses) {
            const assignments = (await axios_1.default.get(`${this.auth.canvas_url}/api/v1/courses/${course.id}/assignments?per_page=100`, {
                headers: { 'Authorization': `Bearer ${this.auth.canvas_token}` }
            })).data.map((v) => {
                const description = Cheerio.load(v.description || '');
                return {
                    id: v.id,
                    name: v.name,
                    description: description('p, h1, h2, h3, h4, h5, h6'),
                    urls: description('a').map((i, e) => e.attribs.href).get(),
                    due: new Date(v.due_at),
                    complete: false // TODO
                };
            });
            if (!assignments) {
                continue; // This can happen
            }
            ;
            course.assignments = assignments;
            this.emit('class', course.name, course);
        }
        ;
    }
    ;
}
exports.default = Canvas;
;
