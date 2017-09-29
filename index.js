var http = require('http');
var fs = require('fs');
var path = require('path'); 
var mkdirp = require('mkdirp');
var sys = require('util');
var exec = require('child_process').exec;
var log = require('single-line-log').stdout;

var ROOT = path.dirname(__filename) + "/";
var VIDEO = ROOT + "videos/";
var VIDEO_DATA = VIDEO + "data/";

var CONFIG = JSON.parse(fs.readFileSync('data.json', 'utf8'));

CONFIG.forEach(function (element){
	var xxx = setInterval(function(){
		if(element.allow && element.count >= element.maxTotalToJoin){
			processFile(element);
			element.allow = false;
		}
		if(element.allow){
			var request = http.request( element.baseUrl + 'v.m3u8', function (res) {
				var data = '';
				res.on('data', function (chunk) {
					data += chunk;
				});
				res.on('end', function () {
					processDateOfM38U(data, element);
				});
			});
			request.on('error', function (e) {
				console.log(e.message);
			});
			request.end();
		}else{
			//do nothing
		}
		showInfo();
	}, 1500);
})

function processFile(element){
	
	setTimeout(function(){
		var folder = VIDEO_DATA + element.name + "/";
		excuteAFunction("cat " + folder + "* > " + folder + "file_video.ts", function(){
			var fileName = formatDate() + "_" + element.name + ".mp4";
			excuteAFunction("ffmpeg -i " + folder + "file_video.ts -acodec copy -vcodec copy " + VIDEO + fileName, function(){
				excuteAFunction("rm " + folder + "*.ts", function(){
					element.allow = true;
					element.count = 0;
				});
			});
		});
	}, 0);
}

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minute = d.getMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day, hour, minute].join('');
}

function excuteAFunction(func, funcWhenDone){
	var x1 = exec(func, function (error, stdout, stderr) {
		if (error !== null) {
			console.log('exec error: ' + error);
		}else{
			funcWhenDone();
		}
	});
}

function processDateOfM38U(data, element){
	var abc = data.split("\n");
	for(var i=0; i<abc.length; i++){
		var line = abc[i];
		if(line.indexOf(".ts") >= 0){
			element.line = line;
		
			var url = element.baseUrl + line;
			var proFolder = VIDEO_DATA + element.name + "/";
			
			
			if (!fs.existsSync(proFolder)) {
				mkdirp(proFolder, function(err) {
					console.log(err);
				});
			}
			var fileDest = proFolder + line;
			if (!fs.existsSync(fileDest)){
				element.count++;
				ndownload(url, fileDest, function(){});
			}
		}
	}
}

function showInfo(){
	log.clear();
	var showLine = "";
	CONFIG.forEach(function (xxx){
		if(!xxx.allow){
			showLine += xxx.name + " : " + pad('pause', 10) + " | ";
		}else{
			showLine += xxx.name + " : " + pad(xxx.count, 10) + " | ";
		}
	});
	log(showLine);
}

function pad(num, size) {
    var s = num+"";
    var cs = "";
    while ((s.length + cs.length) < size)
    	cs += " ";
    return s + cs;
}

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

