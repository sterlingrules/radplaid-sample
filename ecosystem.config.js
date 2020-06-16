module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [{
		name: 'Client',
		script: 'index.js',
		instances: 'max',
		exec_mode: 'cluster',
		trace: true,
		env: {
			NODE_ENV: 'local'
		},
		env_staging: {
			NODE_ENV: 'staging'
		},
		env_production: {
			NODE_ENV: 'production'
		}
	}]
}
