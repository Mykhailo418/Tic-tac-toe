'use strict';

const juice = require('juice');
const mail_config = require('../configs/mailConfigs');
const {mode, public: public_config, url: site_url, port} = require('../configs/default');
const ejs = require('ejs');
const path = require('path');
const pick = require('lodash/pick');

const nodemailer = require('nodemailer');
const { htmlToText } = require('nodemailer-html-to-text');
const stubTransport = require('nodemailer-stub-transport');
const SMTPTransport = require('nodemailer-smtp-transport');

// Settings
const transportEngine = (mode == 'test_prod' || process.env.MAILER_DISABLED) ? stubTransport() :
  	new SMTPTransport({
	  service: "Gmail",
	  debug: true,
	  auth: {
	    user: mail_config.gmail.user,
	    pass: mail_config.gmail.password
	  }
});

const transport = nodemailer.createTransport(transportEngine);
transport.use('compile', htmlToText());

// Function
module.exports = async function(options){
	let message = {};
	let sender = mail_config.senders[options.from || 'default'];
	if (!sender) { throw new Error("Unknown sender:" + options.from); }
	
	// From
	message.from = {
	    name: sender.fromName,
	    address: sender.fromEmail
	};

	// Template
	let locals = Object.assign(options, sender, mail_config);
	let local_params = ['login', 'verify_link'];
	locals.verify_link = `${site_url}:${port}/verify?token=${locals.token}&email=${locals.to}`;
	message.html = ejs.renderFile(path.join(public_config.html, 'email') + '.ejs', pick(locals, local_params));
 	message.html = juice(await message.html);

 	// To
 	message.to = (typeof options.to == 'string') ? {address: options.to} : options.to;
	if (!message.to.address) {
	    throw new Error("No email for recepient, message options:" + JSON.stringify(options));
	}
	// Subject
	message.subject = options.subject;
	// headers
  	message.headers = options.headers;
  	// Send Message
  	return await transport.sendMail(message);
}
