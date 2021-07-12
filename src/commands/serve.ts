import {Command, flags} from '@oclif/command';
import { app, server } from '../utils/graphql';

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
    const port = process.env.PORT || 4000;
    this.log(`Starting GraphQl server ${port}`);
    await server.start();
    server.applyMiddleware({ app, path: "/" });
    await new Promise(resolve => app.listen({ port }, resolve));
    this.log(`🚀 GraphQL Server is now ready`);
  }
};