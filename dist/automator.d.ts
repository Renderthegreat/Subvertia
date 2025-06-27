import EventEmitter from 'events';
import { Course } from '~/context';
export declare class Automator extends EventEmitter {
    constructor();
    ready(): void;
    auth: Record<string, string>;
}
export declare class GlobalAutomation extends EventEmitter {
    automators: Record<string, Automator>;
    constructor(automators: Record<string, Automator>);
    classes: Record<string, Course>;
}
export declare function loadAutomators(): Promise<Record<string, Automator>>;
export declare function loadAuthMethods(): Record<string, string>;
