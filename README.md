# Download videos from file m3u8

Have just test on Ubuntu using nodejs

(*) The first download this source <br> or using git clone https://github.com/trinhbiendich/download-video-from-m3u8-file.git
(*) cd to this source
(*) change the folder to save, and link to download
var baseUrl = "http://test/chn/DNG7/";
var folder = "YOUR_FOLDER_TO_SAVE_FILE";
var request = http.request('http://test/v.m3u8', function (res) {
(*) Run nodejs command , npm install
(*) Run to download by : node index.js
(*) after download done, cd to videos download folder
(*) Run "cat * > file_video.ts"

## Now, You can open file_video.ts by VLC
