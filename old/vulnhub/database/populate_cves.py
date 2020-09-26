""" CVE CRUD operations with database

    Actions:
        Populate CVEs to database
        Update CVES.
"""
from vulnhub.database.datapipeline import DataPipeline
from vulnhub.util.sharedactions import cleanup, download_xml_zip
from vulnhub.util.cvexmlparser import cvexmlparser
from vulnhub.util.spider_cves import get_cve_feeds


def populate_cve(filename, pipeline):
    """
    Save CVEs to database
    :param filename: CVE XML Feed to save into database
    :param pipeline: Database connection object
    :return: None
    """
    print("[+] Parsing CVE XML File {}".format(filename))
    cve_entries = cvexmlparser(filename)
    print("[+] Parsing completed")
    print("[+] Adding to database")

    pipeline.process_cve_many(cve_entries)
    print("[+] Done")


def update_cve_dictionary():
    """
    Update CVEs in the database
    :return: None
    """
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
    """
    Initiate CVE Population
    Dummy function to start CVE population - For export outside the module
    :return: None
    """
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
