import * as fs from'fs';
import * as zlib from 'zlib';
import { BASE_DIR, DOWNLOAD_FEEDS, UPDATE_CVE_FEEDS_RECENT, UPDATE_CVE_FEEDS_MODIFIED } from './constants';
const fetch = require('node-fetch');

type Entry = {
  idx: string,
  uri: string,
  compressed: string,
  json: string,
};
// checks whether a file exists
const fileExists = (filePath: string) => {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
};

const gunzipFile = (source: string, destination: string, callback: any) => {
	// check if source file exists
	if (!fileExists(source) ) {
		throw new Error("File does not exist");
	}
	try {
		// prepare streams
		var src = fs.createReadStream(source);
		var dest = fs.createWriteStream(destination);
    // extract the archive
    const unzip = zlib.createUnzip();
		src.pipe(unzip).pipe(dest).on('error', (err) => {
      throw err;
    });
    src.close();
    dest.close();
    fs.unlinkSync(source);
		// callback on extract completion
		dest.on('close', function() {
      src.close();
      dest.close();
			if ( typeof callback === 'function' ) {
				callback();
			}
		});
	} catch (err) {
		console.error('error in extracting feed');
	}
};

const cveFeedDownload = async (entry: any) => {
  fetch(entry.uri)
  .then((res: any) => {
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
          console.log(`Feed: ${entry.idx} saved`)
        }
      });

    });
  })
  .catch((err: any) => {
    console.log(`Failed to get entry for feed: ${entry.idx}. Try downloading again`);
  });
};

export const deltaFeeds = () => {
  cveFeedDownload(UPDATE_CVE_FEEDS_RECENT);
  cveFeedDownload(UPDATE_CVE_FEEDS_MODIFIED);
};

export const getFeeds = async () => {
  if(!fs.existsSync(BASE_DIR)){
    fs.mkdirSync(BASE_DIR);
  }
  for await (const entry of DOWNLOAD_FEEDS) {
    cveFeedDownload(entry);
  };
};