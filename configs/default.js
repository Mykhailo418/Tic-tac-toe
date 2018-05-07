module.exports = {
	port: 8000,
	secret: 'mysecret',
  	root: process.cwd(),
  	public: {
  		html:  `${process.cwd()}/public/html`
  	},
  	db: {
  		host: 'mongodb://localhost/tic_tac_toe'
  	}
}