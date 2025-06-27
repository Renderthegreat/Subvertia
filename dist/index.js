"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
const fastify_1 = __importDefault(require("fastify"));
const automator_1 = require("~/automator");
const fastify = (0, fastify_1.default)();
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
    const automators = await (0, automator_1.loadAutomators)();
    const web = new automator_1.GlobalAutomation(automators);
    fastify.listen({
        port: 3000,
        host: '0.0.0.0'
    });
}
;
main();
