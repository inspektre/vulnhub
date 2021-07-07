import {Command, flags} from '@oclif/command';
import { getFeeds } from '../utils/feeds';

export default class Download extends Command {
  static description = 'Download NVD feeds'

  static examples = [
    `$ vulnhub download
    `,
  ];

  static flags = {
    help: flags.help({char: 'h'})
  };

  static args = [];

  async run() {
    // const {args, flags} = this.parse(Download);
    await getFeeds();
  }
}
