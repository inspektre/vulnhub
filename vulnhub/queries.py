from itertools import groupby
from .datapipeline import DataPipeline
import json


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
    results = datapileline.query_cpe(cpeid, search_limit)
    return print_json(results)


def search_vulnerabilities(cveid, search_limit):
    datapileline = DataPipeline()
    # Add validation
    results = datapileline.query_cve(cveid, search_limit)
    return print_json(results)


def search_by_year(year, search_limit):
    search_query = 'CVE-' + str(year) + '-%'
    datapileline = DataPipeline()
    # Add validation
    results = datapileline.query_year(search_query, search_limit)
    return print_json(results)

if __name__ == '__main__':
    search_vulnerabilities('CVE-2009-2696')
    search_vulnerable_products('cpe:/h:ruckus:wireless_h500:-')
