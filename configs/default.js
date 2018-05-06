module.exports = {
	port: 8000,
	secret: 'mysecret',
  	root: process.cwd(),
  	public: {
  		html:  `${process.cwd()}/public/html`
  	}
}