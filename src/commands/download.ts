import {Command, flags} from '@oclif/command';
import cli from 'cli-ux';
import { getFeeds } from '../utils/feeds';

export default class Download extends Command {
  static description = 'Download NVD feeds'

  static examples = [
    `$ vulnhub download
    `,
    `$ vulnhub download --seed
    `,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
  };

  static args = [{ name: "123"}];

  async run() {
    cli.action.start('NVD CVE Feeds');
    const {args, flags} = this.parse(Download);
    getFeeds();
    cli.action.stop();
  }
}
