from vulnhub.database.datapipeline import DataPipeline
from vulnhub.util.sharedactions import cleanup, download_xml_zip
from vulnhub.util.cvexmlparser import cvexmlparser
from vulnhub.util.spider_cves import get_cve_feeds


def populate_cve(filename, pipeline):
    print("[+] Parsing CVE XML File {}".format(filename))
    cve_entries = cvexmlparser(filename)
    print("[+] Parsing completed")
    print("[+] Adding to database")

    pipeline.process_cve_many(cve_entries)
    print("[+] Done")


def start_cve_population():
    feeds = get_cve_feeds()
    feeds = list(set(feeds))
    feeds.sort()
    pipeline = DataPipeline()
    cleanup()
    for feed in feeds:
        filename = download_xml_zip(feed)
        populate_cve(filename, pipeline)
        cleanup()
    print("[+]CVEs Populated")


if __name__ == '__main__':
    start_cve_population()
    #populate_cves('test/nvdcve-2.0-recent.xml')
