import {Command, flags} from '@oclif/command'
import { getFeeds } from '../utils/feeds';

export default class Download extends Command {
  static description = 'Download NVD feeds'

  static examples = [
    `$ vulnhub download
    Feed: 2006, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2006.json.gz
    Feed: 2007, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2007.json.gz
    Feed: 2020, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2020.json.gz
    Feed: 2010, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2010.json.gz
    Feed: modified, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-modified.json.gz
    Feed: 2014, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2014.json.gz
    Feed: 2013, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2013.json.gz
    Feed: 2005, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2005.json.gz
    Feed: 2015, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2015.json.gz
    nvdcve-1.1-modified extracted
    Feed: 2012, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2012.json.gz
    Feed: 2003, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2003.json.gz
    Feed: 2008, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2008.json.gz
    Feed: 2017, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2017.json.gz
    Feed: 2009, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2009.json.gz
    Feed: 2018, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2018.json.gz
    Feed: 2021, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2021.json.gz
    Feed: 2016, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2016.json.gz
    Feed: 2019, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2019.json.gz
    Feed: recent, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-recent.json.gz
    nvdcve-1.1-recent extracted
    nvdcve-1.1-2005 extracted
    nvdcve-1.1-2003 extracted
    nvdcve-1.1-2007 extracted
    nvdcve-1.1-2010 extracted
    Feed: 2004, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2004.json.gz
    Feed: 2011, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2011.json.gz
    Feed: 2002, Location: /Users/uday/.config/inspektre/feeds/cve/nvdcve-1.1-2002.json.gz
    nvdcve-1.1-2006 extracted
    nvdcve-1.1-2015 extracted
    nvdcve-1.1-2014 extracted
    nvdcve-1.1-2013 extracted
    nvdcve-1.1-2021 extracted
    nvdcve-1.1-2004 extracted
    nvdcve-1.1-2008 extracted
    nvdcve-1.1-2002 extracted
    nvdcve-1.1-2009 extracted
    nvdcve-1.1-2011 extracted
    nvdcve-1.1-2012 extracted
    nvdcve-1.1-2017 extracted
    nvdcve-1.1-2016 extracted
    nvdcve-1.1-2019 extracted
    nvdcve-1.1-2020 extracted
    nvdcve-1.1-2018 extracted
    `,
  ];

  static flags = {
    help: flags.help({char: 'h'}),
  };

  static args = [];

  async run() {
    const {args, flags} = this.parse(Download);
    getFeeds();
  }
}
