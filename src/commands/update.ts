import {Command, flags} from '@oclif/command'
import { update } from '../utils/seed';
import { deltaFeeds } from '../utils/feeds';

export default class Update extends Command {
  static description = 'Seed NVD CVEs to Neo4J'

  static examples = [
    `$ vulnhub Update
    Feed: 2006, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2006.json.gz
    Feed: 2007, Location: /home/user/.config/inspektre/feeds/cve/nvdcve-1.1-2007.json.gz
    `,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Update);
    deltaFeeds();
    await update();
    this.log('Delta is completed');
    this.exit(0);
  }
}
