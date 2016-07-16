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
			const adapter = ADAPTERS[i].replace(/-/g, ""); //Make sure the adapter name does not include "-"

			try {
				// Create a fake Robot object to intercept incoming messages
				let fakeRobot = {};
				for (let key in this.robot) {
					fakeRobot[key] = this.robot[key];
				}
				fakeRobot.receive = function(message, cb) {
					// Adapter has received a message
					// Prepend adapter name to the room so that we know which adapter the message came from
					message.room = adapter + "-" + message.room;
					this.robot.receive(message, cb);
				}

				this.adapters[adapter] = require(adapter).use(fakeRobot);
				this.robot.loggger.info("[MultiAdapter] Loaded adapter: " + adapter);
			} catch(err) {
				this.robot.logger.info("[MultiAdapter] Adapter not found: " + adapter);
			}
		}
	}

	send(envelope, ...strings) {
		
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
		for (let adapter in this.adapters) {
			adapter.close();
		}
	}
}

exports.use = (robot) => {
	return new MultiAdapter(robot);
}