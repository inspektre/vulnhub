"""Populate NVD CPEs

    Populate the database with NVD CPE URIs (Both 2.2 and 2.3 with Vendor Product Version Information
"""
from vulnhub.database.datapipeline import DataPipeline
from vulnhub.util.sharedactions import cleanup, download_xml_zip
from vulnhub.util.cpexmlparser import cpexmlparser


# Static URL for NVD CPE v 2.3 XML Feed
cpe_latest_zip = 'http://static.nvd.nist.gov/feeds/xml/cpe/dictionary/official-cpe-dictionary_v2.3.xml.zip'


def extract_cpe(cpe_2_2_items):
    """
    Extract NVD CPE Items
    :param cpe_2_2_items:
    :return: Python Generator
    """
    for cpe_2_2_item in cpe_2_2_items:
        yield cpe_2_2_item.attributes['name'].value


# Read XML
def get_cpe_data(cpe_latest_xml):
    """
    Get CPE data from the downloaded XML Feed
    :param cpe_latest_xml: CPE XML Feed
    :return: CPEs version 2.3 are returned as list of dictionaries
    """
    print("[+] CPE Extraction Started")
    cpe_2_3_dictionary = cpexmlparser(cpe_latest_xml)
    return cpe_2_3_dictionary


def populate_cpes(cpe_entries):
    """
    Save CPEs to database
    :param cpe_entries: CPEs as list of dictionaries.
    :return: None
    """
    print("[+]Writing to database")
    pipeline = DataPipeline()
    pipeline.process_cpe_many(cpe_entries)


def start_cpe_population():
    """
    Dummy function  - Module export function to populate CPEs
    :return: None
    """
    cleanup()
    cpe_data = get_cpe_data(download_xml_zip(cpe_latest_zip))
    cleanup()
    populate_cpes(cpe_data)
