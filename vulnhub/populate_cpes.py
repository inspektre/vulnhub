import glob
import os
import zipfile
import wget

from cpexmlparser import cpexmlparser
from datapipeline import DataPipeline

cpe_latest_zip = 'http://static.nvd.nist.gov/feeds/xml/cpe/dictionary/official-cpe-dictionary_v2.3.xml.zip'

def extract_cpe_zip(cpe_latest_xml_zip):
    filename = ''
    with zipfile.ZipFile(cpe_latest_xml_zip, "r") as z:
        z.extractall(".")
        filename = z.namelist()[0]
    return  filename

# Remove downloaded files and temporary files
def cleanup():
    for current in glob.glob(os.path.join('.', '*.xml')):
        os.remove(current)
    for current in glob.glob(os.path.join('.', '*.zip')):
        os.remove(current)
    for current in glob.glob(os.path.join('.', '*.tmp')):
        os.remove(current)



# Download CPE Update definitions
def download_cpe_xml_zip(cpe_latest_url):
    # Cleanup before downloads
    cleanup()
    cpe_latest_xml_zip = wget.download(cpe_latest_url, bar=wget.bar_adaptive)
    filename = extract_cpe_zip(cpe_latest_xml_zip)
    cpe_latest_xml = filename
    return cpe_latest_xml


def extract_cpe(cpe_2_2_items):
    for cpe_2_2_item in cpe_2_2_items:
        yield cpe_2_2_item.attributes['name'].value

# Read XML
def get_cpe_data(cpe_latest_xml):
    print("[+] CPE Extraction Started")
    #
    # xml_data = dict()
    # with open(cpe_latest_xml) as f:
    #     xml_data = xmltodict.parse(f.read())
    
    cpe_2_3_dictionary = cpexmlparser(cpe_latest_xml)

    return cpe_2_3_dictionary


def populate_cpes(cpe_data):
    print("[+]Writing to database")
    pipeline = DataPipeline()

    cpe_entries = []
    for cpe_item in extract_cpe(cpe_data):
        cpe_entry = dict()
        cpe_entry['cpe_id'] = cpe_item
        cpe_entries.append(cpe_entry)

    pipeline.process_cpe_many(cpe_entries)






if __name__ == '__main__':
    cpe_data = ''
    cpe_data = get_cpe_data(download_cpe_xml_zip(cpe_latest_zip))
    cleanup()
    populate_cpes(cpe_data)
