import {Command, flags} from '@oclif/command';
import { extractFeeds } from '../utils/cveHelpers';

export default class Extract extends Command {
  static description = 'Extract NVD feeds'

  static examples = [
    `$ vulnhub extract
    `,
  ];

  static flags = {
    help: flags.help({char: 'h'})
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Extract);
    extractFeeds();
  }
}
