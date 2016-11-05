import json
from itertools import groupby
from .datapipeline import DataPipeline


def print_json(results):
    formatted_results = {}
    vulnerability_counter = []
    product_counter = []
    for row in results:
        print(row.cve_id)
        if row.cve_id is not None:
            vulnerability_counter.append(row.cve_id)
        if row.software_list is not None:
            for cpe in row.software_list:
                product_counter.append(cpe)
        product_counter = list(set(product_counter))

    formatted_results['CVEID'] = vulnerability_counter
    formatted_results['CPEID'] = product_counter

    print("------------------------------------")
    print("{} vulnerabilities were detected".format(len(vulnerability_counter)))
    print("{} Product instances were detected".format(len(product_counter)))
    print("------------------------------------")
    print(json.dumps(formatted_results['CVEID']))
    print(json.dumps(formatted_results['CPEID']))


def search_vulnerable_products(cpeid, search_limit):
    datapileline = DataPipeline()
    # Add validation
    results = datapileline.query_cpe(cpeid, search_limit)
    print_json(results)

def search_vulnerabilities(cveid, search_limit):
    datapileline = DataPipeline()
    # Add validation
    results = datapileline.query_cve(cveid, search_limit)
    print_json(results)


def search_by_year(year, search_limit):
    search_query = 'CVE-' + str(year) + '-%'
    datapileline = DataPipeline()
    # Add validation
    results = datapileline.query_year(search_query, search_limit)
    print_json(results)

if __name__ == '__main__':
    search_vulnerabilities('CVE-2009-2696')
    search_vulnerable_products('cpe:/h:ruckus:wireless_h500:-')
