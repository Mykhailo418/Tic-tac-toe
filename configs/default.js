module.exports = {
	port: 8000,
	secret: 'mysecret',
  	root: process.cwd(),
  	mode: 'test',
    url: 'http://localhost',
  	public: {
  		html:  `${process.cwd()}/public/html`
  	},
  	db: {
  		host: 'mongodb://localhost/tic_tac_toe'
  	},
  	hash: {
	  length:     128,
	  // may be slow(!): iterations = 12000 take ~60ms to generate strong password
	  iterations: this.mode == 'prod' ? 12000 : 1
	}
}