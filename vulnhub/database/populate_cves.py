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


def update_cve_dictionary():
    print("[+] Updating CVE Dictionary")
    feeds = list(set(get_cve_feeds()))
    feeds.sort()
    update_feeds = []
    pipeline = DataPipeline()
    cleanup()
    for feed in feeds:
        if 'Modified' in feed:
            update_feeds.append(feed)
        elif 'Recent' in feed:
            update_feeds.append(feed)
        else:
            pass
    for update_feed in update_feeds:
        filename = download_xml_zip(update_feed)
        populate_cve(filename, pipeline)
        cleanup()
    print("[+]CVEs Updated")


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
