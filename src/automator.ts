import fs from 'fs-extra';
import path from 'path';
import dotenv from 'dotenv';
import EventEmitter from 'events';
import TOML from 'toml';

import { Course, Assignment, AssignmentData } from '~/context';

export class Automator extends EventEmitter {
	constructor() {
		super();
	};

	public ready(): void { };
	public submit(data: AssignmentData): void { };

	public auth = loadAuthMethods();
};

export class GlobalAutomation extends EventEmitter {
	constructor(
		public automators: Record<string, Automator>
	) {
		super();
		this.on('class', (name, class_: Course) => {
			this.classes[name] = class_;
		});

		for (const [path, automator] of Object.entries(this.automators)) {
			automator.on('class', (name, class_: Course) => {
				this.classes[name] = class_;
				console.log(this.classes[name].assignments[0]);
			});
			automator.on('assignment', (name, assignment: Assignment) => {
				this.emit('assignment', name, assignment);
			});
			automator.ready();
		};
	};


	public classes: Record<string, Course> = {};
};

export async function loadAutomators(): Promise<Record<string, Automator>> {
	const config = await fs.readFile(path.join(process.cwd(), 'config.toml'), 'utf-8');
	const automators = TOML.parse(config).Automators;
	return Object.fromEntries(automators.map((v: any) => {
		return [v.path, new (require(v.path).default)];
	}));
};

export function loadAuthMethods(): Record<string, string> {
	const auth = dotenv.config().parsed || {};
	return auth;
};