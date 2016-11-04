import wget

from cvexmlparser import cvexmlparser
from datapipeline import DataPipeline
from spider_cves import get_cve_feeds
from populate_cpes import *

def get_cve_all():
    feeds = get_cve_feeds()
    feeds = list(set(feeds))
    feeds.sort()
    for feed in feeds:
        filename = download_cpe_xml_zip(feed)
        populate_cves(filename)
        cleanup()
    print("[+]CVEs Populated")



def populate_cves(cvefilename):
    print("[+] Parsing CVE XML File {}".format(cvefilename))
    cve_entries = cvexmlparser(cvefilename)
    print("[+] Parsing completed")
    print("[+] Adding to database")
    pipeline = DataPipeline()
    pipeline.process_cve_many(cve_entries)
    print("[+] Done")



if __name__ == '__main__':
    get_cve_all()
    #populate_cves('test/nvdcve-2.0-recent.xml')
