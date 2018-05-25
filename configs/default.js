let os = require("os");

module.exports = {
	port: process.env.PORT || 8000,
	secret: 'mysecret',
  	root: process.cwd(),
  	mode: 'prod',
    url: os.hostname() || 'http://localhost',
  	public: {
  		html:  `${process.cwd()}/public/html`
  	},
  	db: {
  		host: 'mongodb://Michael:123@ds245687.mlab.com:45687/tic_tac_toe'
  	},
  	hash: {
	  length:     128,
	  // may be slow(!): iterations = 12000 take ~60ms to generate strong password
	  iterations: this.mode == 'production' ? 12000 : 1
	}
}