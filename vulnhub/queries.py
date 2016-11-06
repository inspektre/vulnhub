from itertools import groupby
from .datapipeline import DataPipeline
import json
import re
import sys
from .datapipeline import drop_cpes
from .datapipeline import drop_cves
from .datapipeline import initialize


def process_cpe_drop():
    # Request for dropping db table for CPEs
    drop_cpes()


def process_cve_drop():
    # Request for dropping db talbe for CVEs
    drop_cves()


def process_dbinit():
    # Drop tables and initalize tables
    initialize()


def validate_year(year):
    year_pattern = re.compile('\d\d\d\d')
    if year_pattern.findall(year):
        return True
    return False


def validate_cve(cveid):
    cve_pattern = re.compile('CVE-\d\d\d\d-\d\d\d\d')
    if cve_pattern.findall(cveid):
        return True
    return False


def validate_cpe(cpeid):
    cpe_pattern = re.compile('cpe:/[aoh]:.*:.*:.*')
    if cpe_pattern.findall(cpeid):
        return True
    return False


def print_json(results):
    formatted_results = {}
    for result in results:
        result_dictionary = dict()
        result_dictionary['cveid'] = result.cve_id
        result_dictionary['cpes'] = result.software_list
        formatted_results[result.cve_id] =  result_dictionary
    return json.dumps(formatted_results)


def search_vulnerable_products(cpeid, search_limit):
    datapileline = DataPipeline()
    # Add validation
    if not validate_cpe(cpeid):
        sys.exit(print("Invalid CPEID"))
    results = datapileline.query_cpe(cpeid, search_limit)
    return print_json(results)


def search_vulnerabilities(cveid, search_limit):
    datapileline = DataPipeline()
    # Add validation
    if not validate_cve(cveid):
        sys.exit(print("Invalid CVEID"))
    results = datapileline.query_cve(cveid, search_limit)
    return print_json(results)


def search_by_year(year, search_limit):
    year_string = str(year)
    search_query = 'CVE-' + year_string + '-%'
    datapileline = DataPipeline()
    # Add validation
    if not validate_year(search_query):
        sys.exit(print("Invalid Year"))
    results = datapileline.query_year(search_query, search_limit)
    return print_json(results)


if __name__ == '__main__':
    search_vulnerabilities('CVE-2009-2696')
    search_vulnerable_products('cpe:/h:ruckus:wireless_h500:-')
