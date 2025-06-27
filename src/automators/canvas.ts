import { Automator } from '~/automator';
import { Course, Assignment, AssignmentData } from '~/context';
import Axios from 'axios';
import * as Cheerio from 'cheerio';

export default class Canvas extends Automator {
	constructor() {
		super();
	};
	public async ready() {
		const courses: Course[] = ((await Axios.get(`${this.auth.canvas_url}/api/v1/courses?enrollment_state=all`, {
			headers: {
				'Authorization': `Bearer ${this.auth.canvas_token}`
			}
		})).data as Array<Record<string, any>>).map((v: any) => {
			return {
				id: v.id,
				name: v.name,
				assignments: []
			};
		});

		for (const course of courses) {
			const assignments: Assignment[] = ((await Axios.get(`${this.auth.canvas_url}/api/v1/courses/${course.id}/assignments?per_page=100`, {
				headers: { 'Authorization': `Bearer ${this.auth.canvas_token}` }
			})).data as Array<Record<string, any>>).map((v: any) => {
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
			};
			course.assignments = assignments;
			this.emit('class', course.name, course);
		};

	};
	public async submit(data: AssignmentData) {

	};
};