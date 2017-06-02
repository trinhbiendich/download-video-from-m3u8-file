# Download videos from file m3u8

Have just test on Ubuntu using nodejs <br>

* The first download this source or using git clone https://github.com/trinhbiendich/download-video-from-m3u8-file.git <br>
* cd to this source <br>
* change the folder to save, and link to download <br>
var baseUrl = "http://test/chn/DNG7/"; <br>
var folder = "YOUR_FOLDER_TO_SAVE_FILE"; <br>
var request = http.request('http://test/v.m3u8', function (res) { <br> <br>
* Run nodejs command , npm install <br>
* Run to download by : node index.js <br>
* after download done, cd to videos download folder <br>
* Run "cat * > file_video.ts" <br> <br>

## Now, You can open file_video.ts by VLC
