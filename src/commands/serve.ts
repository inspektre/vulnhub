import {Command, flags} from '@oclif/command';
import { server, port } from '../utils/graphql';

export default class Serve extends Command {
  static description = 'Start Graphql Server'

  static examples = [
    `$ vulnhub serve
    `,
  ];

  static flags = {
    help: flags.help({char: 'h'})
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Serve);
    this.log(`Starting GraphQl server ${port}`);
    await server.listen(port);
  }
}
