from bs4 import BeautifulSoup
from urllib.request import urlopen


def get_cve_feeds():
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



