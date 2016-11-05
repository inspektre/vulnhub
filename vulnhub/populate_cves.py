import wget

from .cvexmlparser import cvexmlparser
from .datapipeline import DataPipeline
from .spider_cves import get_cve_feeds
from .populate_cpes import *

def start_cve_population():
    feeds = get_cve_feeds()
    feeds = list(set(feeds))
    feeds.sort()
    pipeline = DataPipeline()
    for feed in feeds:
        filename = download_cpe_xml_zip(feed)
        populate_cves(filename, pipeline)
        cleanup()
    print("[+]CVEs Populated")


def populate_cves(filename, pipeline):
    print("[+] Parsing CVE XML File {}".format(filename))
    cve_entries = cvexmlparser(filename)
    print("[+] Parsing completed")
    print("[+] Adding to database")

    pipeline.process_cve_many(cve_entries)
    print("[+] Done")



if __name__ == '__main__':
    start_cve_population()
    #populate_cves('test/nvdcve-2.0-recent.xml')
