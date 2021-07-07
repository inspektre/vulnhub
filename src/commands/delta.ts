import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import { update } from '../utils/seed';
import { deltaFeeds } from '../utils/feeds';

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
  };

  static args = [];

  async run() {
    cli.action.start('CVE Feed Updates');
    const {args, flags} = this.parse(Delta);
    deltaFeeds();
    await update();
    cli.action.stop();
    this.exit(0);
  }
}
