"""Queries

    Consume datapipeline as a proxy to access the database CRUD Operations.
    All Inputs should go through this modules for validation.
    All database outputs must go through this module for Export options.
"""

import json
import re
import sys

from vulnhub.database.datapipeline import DataPipeline
from vulnhub.database.datapipeline import drop_cpes
from vulnhub.database.datapipeline import drop_cves
from vulnhub.database.datapipeline import initialize


def process_cpe_drop():
    """
    Drop CVEs in database
    :return: None
    """
    # Request for dropping db table for CPEs
    drop_cpes()


def process_cve_drop():
    """
    Drop CVEs in database
    :return: None
    """
    # Request for dropping db talbe for CVEs
    drop_cves()


def process_dbinit():
    """
    Initialize database - Drop tables if existing and Create tables from schema
    :return: None
    """
    # Drop tables and initalize tables
    initialize()


def validate_year(year):
    """
    Validate Year for vulnerabilities form User.
    :param year: Numeric quantity representing a year
    :return: True or False Boolean
    """
    year_pattern = re.compile('\d\d\d\d')
    if year_pattern.findall(year):
        return True
    return False


def validate_cve(cveid):
    """
    Validate CVE Identifier from User
    :param cveid: CVE ID
    :return: True or False Boolean
    """
    cve_pattern = re.compile('CVE-\d\d\d\d-\d\d\d\d')
    if cve_pattern.findall(cveid):
        return True
    return False


def validate_cpe(cpeid):
    """
    Validate a CPE URI from User
    :param cpeid: CPE URI
    :return: TRUE or False Boolean
    """
    cpe_pattern = re.compile('cpe:/[aoh]:.*:.*:.*')
    if cpe_pattern.findall(cpeid):
        return True
    return False


def print_json(results):
    """
    JSONify Search results for consumption
    :param results: Database search results
    :return: JSON Object
    """
    formatted_results = {}
    for result in results:
        result_dictionary = dict()
        result_dictionary['cveid'] = result.cve_id
        result_dictionary['cpes'] = result.software_list
        formatted_results[result.cve_id] =  result_dictionary
    return json.dumps(formatted_results)


def search_vulnerable_products(cpeid, search_limit):
    """
    Search for vulnerability information with CPE URI
    :param cpeid: CPE 2.2 URI
    :param search_limit: Numerical quantity to limit search results
    :return:
    """
    datapileline = DataPipeline()
    # Add validation
    if not validate_cpe(cpeid):
        sys.exit(print("Invalid CPEID"))
    results = datapileline.query_cpe(cpeid, search_limit)
    return print_json(results)


def search_vulnerabilities(cveid, search_limit):
    """
    Seach for Vulnerability information
    :param cveid: CVE Identifier
    :param search_limit: Numberical quantity to limit search results
    :return: JSON object with results
    """
    datapileline = DataPipeline()
    # Add validation
    if not validate_cve(cveid):
        sys.exit(print("Invalid CVEID"))
    results = datapileline.query_cve(cveid, search_limit)
    return print_json(results)


def search_by_year(year, search_limit):
    """
    Search vulnerabilities by Year
    :param year: Numerical quantity to represent year
    :param search_limit: Numerical quantity to limit Search results.
    :return: JSON Object with results
    """
    year_string = str(year)
    search_query = 'CVE-' + year_string + '-%'
    datapileline = DataPipeline()
    # Add validation
    if not validate_year(search_query):
        sys.exit(print("Invalid Year"))
    results = datapileline.query_year(search_query, search_limit)
    return print_json(results)
