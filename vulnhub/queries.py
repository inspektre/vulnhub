import json
from itertools import groupby
from .datapipeline import DataPipeline


def print_json(results):
    formatted_results = {}
    vulnerability_counter = 0
    product_counter = []
    for row in results:
        formatted_results['CVEID'] = row.cve_id
        formatted_results['CPEs'] = row.software_list

        if row.cve_id is not None:
            vulnerability_counter += 1
        if row.software_list is not None:
            for cpe in row.software_list:
                product_counter.append(cpe)
    product_counter = list(set(product_counter))

    print("------------------------------------")
    print("{} vulnerabilities were detected".format(vulnerability_counter))
    print("{} Product instances were detected".format(len(product_counter)))
    print("------------------------------------")
    print(json.dumps(formatted_results))


def search_vulnerable_products(cpeid):
    datapileline = DataPipeline()
    results = datapileline.query_cpe(cpeid)
    print_json(results)

def search_vulnerabilities(cveid):
    datapileline = DataPipeline()
    results = datapileline.query_cve(cveid)
    print_json(results)


def search_by_year(year):
    search_query = 'CVE-' + str(year) + '-%'
    datapileline = DataPipeline()

    results = datapileline.query_year(search_query)
    print_json(results)

if __name__ == '__main__':
    search_vulnerabilities('CVE-2009-2696')
    search_vulnerable_products('cpe:/h:ruckus:wireless_h500:-')
