import {Command, flags} from '@oclif/command'
import { seed } from '../utils/seed';
import { createIndices, createGraphs } from '../utils/cveHelpers';

export default class Seed extends Command {
  static description = 'Seed NVD CVEs to Neo4J'

  static examples = [
    `$ vulnhub seed --ensure-index
    CVE node indices will be crated/checked
    Feed: 2006, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2006.json.gz
    Feed: 2007, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2007.json.gz
    `,
    `$ vulnhub seed --create-graphs
    CVE node indices will be crated/checked
    Feed: 2006, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2006.json.gz
    Feed: 2007, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2007.json.gz
    `,
    `$ vulnhub seed --ensure-index --create-graphs
    CVE node indices will be crated/checked
    Feed: 2006, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2006.json.gz
    Feed: 2007, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2007.json.gz
    `,
    `$ vulnhub seed
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
    const {args, flags} = this.parse(Seed);
    await seed();
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
