var http = require('http');
var fs = require('fs');
var path = require('path'); 


var baseUrl = "http://test/chn/DNG7/";
var folder = "YOUR_FOLDER_TO_SAVE_FILE";

var xxx = setInterval(function(){
	var request = http.request('http://test/v.m3u8', function (res) {
		var data = '';
		res.on('data', function (chunk) {
		    data += chunk;
		});
		res.on('end', function () {
			var abc = data.split("\n");
			for(var i=0; i<abc.length; i++){
				var line = abc[i];
				if(line.indexOf(".ts") >= 0){
					console.log("\n\n");
					console.log("=============================");
					console.log("Download for : " + line);
					var url = baseUrl + line;
					var fileDest = folder + line;
					if (fs.existsSync(fileDest)) {
						console.log("File downloaded.!");
					}else{
						ndownload(url, fileDest, function(){});
					}
					console.log("=============================");
					console.log("\n");
				}
			}
		});
	});
	request.on('error', function (e) {
		console.log(e.message);
	});
	request.end();
	//clearInterval(xxx);
}, 1500);


var ndownload = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = http.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

