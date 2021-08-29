import {Command, flags} from '@oclif/command';
import { callSetGraphs } from '../utils/graph';
import cli from 'cli-ux';

export default class Graph extends Command {
  static description = 'Set NVD Attack Graphs'

  static examples = [
    `$ vulnhub graph
    `,
  ];

  static flags = {
    help: flags.help({char: 'h'})
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Graph);
    cli.action.start('setting graphs');
    await callSetGraphs();
    cli.action.stop();
  }
}
