"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalAutomation = exports.Automator = void 0;
exports.loadAutomators = loadAutomators;
exports.loadAuthMethods = loadAuthMethods;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const events_1 = __importDefault(require("events"));
const toml_1 = __importDefault(require("toml"));
class Automator extends events_1.default {
    constructor() {
        super();
    }
    ;
    ready() { }
    ;
    auth = loadAuthMethods();
}
exports.Automator = Automator;
;
class GlobalAutomation extends events_1.default {
    automators;
    constructor(automators) {
        super();
        this.automators = automators;
        this.on('class', (name, class_) => {
            this.classes[name] = class_;
        });
        for (const [path, automator] of Object.entries(this.automators)) {
            automator.on('class', (name, class_) => {
                this.classes[name] = class_;
                console.log(this.classes[name].assignments[0]);
            });
            automator.on('assignment', (name, assignment) => {
                this.emit('assignment', name, assignment);
            });
            automator.ready();
        }
        ;
    }
    ;
    classes = {};
}
exports.GlobalAutomation = GlobalAutomation;
;
async function loadAutomators() {
    const config = await fs_extra_1.default.readFile(path_1.default.join(process.cwd(), 'config.toml'), 'utf-8');
    const automators = toml_1.default.parse(config).Automators;
    return Object.fromEntries(automators.map((v) => {
        return [v.path, new (require(v.path).default)];
    }));
}
;
function loadAuthMethods() {
    const auth = dotenv_1.default.config().parsed || {};
    return auth;
}
;
