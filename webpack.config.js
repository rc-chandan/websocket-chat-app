module.exports = {
	entry: __dirname + '/client',
	output: {
		path: __dirname + '/client/dist',
		filename: 'bundle.js',
	},
	module: {
	    loaders: [
	      	{ 
			    test: /\.js?$/,         // Match both .js and .jsx files
			    exclude: /node_modules/, 
			    loader: "babel-loader", 
			    query:
			      {
			        presets:['react', 'es2015', 'stage-0']
			      }
			}
		]
  	},
	devtool: 'source-map',
}