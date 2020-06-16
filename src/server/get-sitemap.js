var fs = require('fs');
var request = require('superagent');
var parser = require('xml2json');
var http = require('http');
var https = require('https');
var path = require('path');

module.exports = function (callback) {
	let url = 'localhost:8000';
	let protocol = 'http';
	let request = {
		http: http,
		https: https
	}

	switch (process.env.NODE_ENV) {
		case 'staging':
			url = 'api-dev.getradplaid.com';
			protocol = 'https';
			break
		case 'production':
			url = 'api.getradplaid.com';
			protocol = 'https';
			break
	}

	request[protocol].get(`${protocol}://${url}/sitemap.xml`, (res) => {
		let xml = ''

		res.on('data', (chunk) => {
			xml += chunk
		});

		res.on('error', (err) => {
			console.error(err)
			callback()
		});

		res.on('timeout', (err) => {
			console.error(err)
			callback()
		});

		res.on('end', () => {
			let _json = JSON.parse(parser.toJson(xml))

			if (!_json.urlset) {
				return callback && callback()
			}

			let urls = _json.urlset.url.map(u => u.loc)

			urls = urls.map((path, index) => {
				return path.replace(`${protocol}://${url}`, '')
			})

			fs.writeFileSync(__dirname + '/../../public/sitemap.xml', xml)
			fs.writeFileSync(__dirname + '/../../sitemap.json', JSON.stringify(urls))

			if (callback) {
				callback()
			}
		});
	});
}
