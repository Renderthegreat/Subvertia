require('module-alias/register');

import Inquirer from '@inquirer/prompts';
import Fastify from 'fastify';

import { Automator, GlobalAutomation, loadAutomators } from '~/automator';

const fastify = Fastify();

fastify.get('/*', async (request, reply) => {
	// TODO: Do some vue rendering...

	reply.send(`
		<!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Subvertia</title>
			</head>
			<body>
				<div id="app"></div>
			</body>
		</html>
	`);
});

fastify.get('/api/*', async (request, reply) => {

});

async function main() {
	const automators = await loadAutomators();
	const web = new GlobalAutomation(automators);

	fastify.listen({
		port: 3000,
		host: '0.0.0.0'
	});
};

main();