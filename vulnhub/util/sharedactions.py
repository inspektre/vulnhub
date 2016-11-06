import glob
import os
import zipfile
import wget


def extract_zip(xml_zip):
    with zipfile.ZipFile(xml_zip, "r") as z:
        z.extractall(".")
        filename = z.namelist()[0]
    return filename


# Remove downloaded files and temporary files
def cleanup():
    for current in glob.glob(os.path.join('.', '*.xml')):
        os.remove(current)
    for current in glob.glob(os.path.join('.', '*.zip')):
        os.remove(current)
    for current in glob.glob(os.path.join('.', '*.tmp')):
        os.remove(current)


# Download CPE Update definitions
def download_xml_zip(url):
    # Cleanup before downloads
    cleanup()
    xml_zip = wget.download(url, bar=wget.bar_adaptive)
    filename = extract_zip(xml_zip)
    xml = filename
    return xml
