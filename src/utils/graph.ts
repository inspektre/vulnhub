import got from 'got';
import cli from 'cli-ux';
const dotenv = require('dotenv');
dotenv.config();

// Set Graphs has not been exposed publicly yet.
// Please treat this one as inaccessible for public-use 
// as inspektre does not manage your database
export const callSetGraphs = async () => {
  return await new Promise(async (resolve, reject) => {
    try {
      const options: any = {
        prefixUrl: 'https://inspektre.io/api/nvd/graph',
        headers: {
          'user-agent': 'inspektre-cli',
          'authorization': process.env.NVD_MACHINE_TOKEN
        },
        retry: 5
      };
      const resp: any = await got.post(options);
      resolve({resp});
    } catch(err) {
      reject({});
      cli.error('inspektre knowledge graphs are not exposed publicly, Please contact inspektre for this feature on your private database');
    }
  });
};