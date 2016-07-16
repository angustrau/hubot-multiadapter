"use strict";
const hubot = require("hubot");
const Adapter = hubot.Adapter;

let ADAPTERS = (process.env.HUBOT_MULTIADAPTER_ADAPTERS || "").split(",");
ADAPTERS = ADAPTERS[0] == "" ? [] : ADAPTERS;

class MultiAdapter extends Adapter {
	constructor(robot) {
		super();

		this.robot = robot;
		this.adapters = {};

		for (let i=0;i<ADAPTERS.length;i++) {
			let adapter = ADAPTERS[i];
			try {
				this.adapters[adapter] = require(adapter).use(this.robot);
				this.robot.loggger.info("[MultiAdapter] Loaded adapter: " + adapter);
			} catch(err) {
				this.robot.logger.info("[MultiAdapter] Adapter not found: " + adapter);
			}
		}
	}

	send(envelope, ...strings) {
		this.robot.logger.info(...strings);
	}

	emote(envelope, ...strings) {
		
	}

	reply(envelope, ...strings) {

	}

	topic(envelope, ...strings) {

	}

	play(envelope, ...strings) {

	}

	run() {
		for (let adapter in this.adapters) {
			adapter.run();
		}
	}

	close() {

	}
}

exports.use = (robot) => {
	return new MultiAdapter(robot);
}