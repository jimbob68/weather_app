var merge = require('webpack-merge');
module.exports = {
	configureWebpack: (config) => {
		merge(config, { VUE_APP_weatherKey: process.env.weatherKey, VUE_APP_tomTomKey: process.env.tomTomKey });
	}
};
