import {Command, flags} from '@oclif/command'
import { seed } from '../utils/seed';

export default class Seed extends Command {
  static description = 'Seed NVD CVEs to Neo4J'

  static examples = [
    `$ vulnhub seed
    Feed: 2006, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2006.json.gz
    Feed: 2007, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2007.json.gz
    `,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Seed);
    seed()
    .then(() => {
      this.log('Seeding is complete');
      process.exit(1);
    })
    .catch(err => this.error('Seeding failed, Please try later or check access to db'));
  }
}
