# -*- coding: utf-8 -*-
"""spider_cves

    This module retrieves NVD CVE Feeds from https://nvd.nist.gov/ CVE Feeds page.
    Static Feed URLs are used, the rest are ignored.
    Feeds are sorted in order of year ascending. Recent and Modifed are the last in the feeds

"""
from urllib.request import urlopen
from bs4 import BeautifulSoup


# Get a list of sorted Feeds.
def get_cve_feeds():
    """
    Get a list of static NVD CVE Feeds and sort them before returning.
    :param:
    :return cve_feeds:Returns: CVE Static Feeds are returned as a sorted list.
    """
    base_url = 'https://nvd.nist.gov/download.cfm#CVE_FEED'
    raw_data = urlopen(url=base_url)
    soup_data = BeautifulSoup(raw_data, "lxml")

    cve_elements = soup_data.find_all('a', href=True)

    cve_feeds = []

    for cve_element in cve_elements:
        if 'nvdcve-2.0' in cve_element['href'] and 'xml.zip' in cve_element['href']:
            if not 'https://nvd.nist.gov/' in cve_element['href']:
                cve_feeds.append(cve_element['href'])
    return cve_feeds
