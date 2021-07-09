import {Command, flags} from '@oclif/command';
import { update } from '../utils/seed';
import { deltaFeeds } from '../utils/feeds';
import { createIndices, createGraphs } from '../utils/cveHelpers';

export default class Delta extends Command {
  static description = 'Seed NVD CVEs to Neo4J'

  static examples = [
    `$ vulnhub delta
    Feed: 2006, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2006.json.gz
    Feed: 2007, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2007.json.gz
    `,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
    'ensure-index': flags.boolean({char: 'e'}),
    'create-graphs': flags.boolean({ char: 'c'})
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Delta);
    deltaFeeds();
    await update();
    if(flags['create-graphs'] && flags['ensure-index']) {
      this.log('CVE node indices will be crated/checked.');
      await createIndices();
      this.log('CVE node graphs will be created/checked.');
      await createGraphs();
    }
    else if(flags['ensure-index']) {
      this.log('CVE node indices will be crated/checked.');
      await createIndices();
    }
    else if(flags['create-graphs']) {
      this.log('CVE node graphs will be created/checked.');
      await createGraphs();
    }
    
    this.exit(0);
  }
}
