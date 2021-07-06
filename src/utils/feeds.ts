import * as fs from'fs';
import * as zlib from 'zlib';
import { BASE_DIR, DOWNLOAD_FEEDS, UPDATE_CVE_FEEDS_RECENT, UPDATE_CVE_FEEDS_MODIFIED } from './constants';

const fetch = require('node-fetch');

// checks whether a file exists
function fileExists(filePath: string) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

var gunzipFile = function(source: string, destination: any, callback: any) {
	// check if source file exists
	if (!fileExists(source) ) {
		throw new Error("File does not exist");
	}
	try {
		// prepare streams
		var src = fs.createReadStream(source);
		var dest = fs.createWriteStream(destination);
    // extract the archive
    // const gzip = zlib.createGunzip();
		src.pipe(zlib.createGunzip()).pipe(fs.createWriteStream(destination)).on('error', (err) => {
      src.close();
      dest.close();
      throw err;
    });
		// callback on extract completion
		dest.on('close', function() {
      src.close();
      dest.close();
			if ( typeof callback === 'function' ) {
				callback();
			}
		});
	} catch (err) {
    
		console.error('error in checking feed');
	}
};


const cveFeedDownload = (entry: any) => {
  fetch(entry.uri)
  .then((res: any) => {
    console.log(`Feed: ${entry.idx}, Location: ${entry.compressed}`);
    const fileStream = fs.createWriteStream(entry.compressed);
    res.body.pipe(fileStream);
    res.body.on("error", (err: any) => {
        fileStream.close();
    });
    fileStream.on("error", () => {
      console.log("Error in saving download for: ", entry.idx);
    })
    fileStream.on("finish", () => {
      fileStream.close();
      gunzipFile(entry.compressed, entry.json,  (err: any, res: any) => {
        if(err) {
          console.error('error in compressed file', entry.compressed);
        }
        else {
          console.log(`nvdcve-1.1-${entry.idx} extracted`);
        }
      });

    });
  })
  .catch((err: any) => {
    console.log(`Failed to get entry for feed: ${entry.idx}. Try downloading again`);
  });
};

export const deltaFeeds = () => {
  console.log('Fetching NVD Delta');
  cveFeedDownload(UPDATE_CVE_FEEDS_RECENT);
  cveFeedDownload(UPDATE_CVE_FEEDS_MODIFIED);
};

export const getFeeds = () => {
  DOWNLOAD_FEEDS.forEach((entry: any) => {
    if(!fs.existsSync(BASE_DIR)){
      fs.mkdirSync(BASE_DIR);
    }
    cveFeedDownload(entry);
  });
};