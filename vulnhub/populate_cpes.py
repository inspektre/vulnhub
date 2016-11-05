

from .cpexmlparser import cpexmlparser
from .datapipeline import DataPipeline
from .util import cleanup, download_xml_zip

cpe_latest_zip = 'http://static.nvd.nist.gov/feeds/xml/cpe/dictionary/official-cpe-dictionary_v2.3.xml.zip'


def extract_cpe(cpe_2_2_items):
    for cpe_2_2_item in cpe_2_2_items:
        yield cpe_2_2_item.attributes['name'].value


# Read XML
def get_cpe_data(cpe_latest_xml):
    print("[+] CPE Extraction Started")
    cpe_2_3_dictionary = cpexmlparser(cpe_latest_xml)
    return cpe_2_3_dictionary


def populate_cpes(cpe_entries):
    print("[+]Writing to database")
    pipeline = DataPipeline()
    pipeline.process_cpe_many(cpe_entries)


def start_cpe_population():
    # Drop CPE table before doing this op
    cleanup()
    cpe_data = get_cpe_data(download_xml_zip(cpe_latest_zip))
    cleanup()
    populate_cpes(cpe_data)

if __name__ == '__main__':
    start_cpe_population()
