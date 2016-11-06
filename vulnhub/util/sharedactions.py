"""Shared Actions

    Reusable function across CVE and CPE Feed downloads extraction and directory cleanup are stored here.
    Current actions:
        Failed downloads, current downloads and existing XML files are removed.
        XML feeds are downloaded form NIST.
        XML (Zipped) files are exapnded.
"""

import glob
import os
import zipfile
import wget


# Extract Zipped archive and return the name of first file
def extract_zip(xml_zip):
    """
    Extract a zipped archive and return the name of the first file.
    :param xml_zip: zipped archive path (Relative or absolute)
    :return filename: First file name in the zipped archive.
    """
    with zipfile.ZipFile(xml_zip, "r") as zipreader:
        zipreader.extractall(".")
        filename = zipreader.namelist()[0]
    return filename


# Remove downloaded files and temporary files
def cleanup():
    """
    Cleanup directory for temporary files, XML feeds and Zipped archives downloaded from NIST
    :return: None
    """
    for current in glob.glob(os.path.join('.', '*.xml')):
        os.remove(current)
    for current in glob.glob(os.path.join('.', '*.zip')):
        os.remove(current)
    for current in glob.glob(os.path.join('.', '*.tmp')):
        os.remove(current)


# Download CPE Update definitions
def download_xml_zip(url):
    """
    Download a NIST Feed from a static URL provided.
    :param url: Provide a NIST CPE OR CVE static feed URL.
    :return: retrun XML File name that was downloaded.
    """
    # Cleanup before downloads
    cleanup()
    xml_zip = wget.download(url, bar=wget.bar_adaptive)
    filename = extract_zip(xml_zip)
    xml = filename
    return xml
