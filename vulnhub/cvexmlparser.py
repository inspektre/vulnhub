import xmltodict
import time
import sys

def cvexmlparser(xmlfile):
    xmldoc = open(xmlfile, 'r')
    xmlcont = xmldoc.read()
    xmldoc.close()
    tree = xmltodict.parse(xmlcont)
    cve_entries = []

    for cve_item in tree['nvd'].get('entry'):
        cve_entry = dict()

        cve_entry['cve_id'] = cve_item['@id']


        #if cve_item.get('vuln:vulnerable-configuration'):
        #    cve_entry['configuration_id'] = cve_item['vuln:vulnerable-configuration']
        cve_entry['configuration_id'] = ''

        if cve_item.get('vuln:vulnerable-software-list') and cve_item['vuln:vulnerable-software-list'].get('vuln:product'):
            cpes_entry = []
            if type(cve_item['vuln:vulnerable-software-list']['vuln:product']) == str:
                cpes_entry.append(cve_item['vuln:vulnerable-software-list']['vuln:product'])

            else:
                cpes_entry = list(cve_item['vuln:vulnerable-software-list']['vuln:product'])

            cve_entry['software_list'] = cpes_entry

        if cve_entry.get('vuln:published-datetime'):
            cve_entry['publish_date'] = cve_item['vuln:published-datetime']

        cve_entry['modified_date'] = cve_item['vuln:last-modified-datetime']

        if cve_item.get('vuln:cvss') and cve_item['vuln:cvss'].get('cvss:base_metrics'):
            cve_entry['Base_Score'] = cve_item['vuln:cvss']['cvss:base_metrics']['cvss:score']


        # CVSS Base Information
        cve_entry['Base_Access_Vector'] = "None"
        cve_entry['Base_Access_Complexity'] = "None"
        cve_entry['Base_Authentication'] = "None"
        cve_entry['Base_Confidentiality_Impact'] = "None"
        cve_entry['Base_Integrity_Impact'] = "None"
        cve_entry['Base_Availability_Impact'] = "None"
        cve_entry['Base_Source'] = "None"
        cve_entry['Base_generation'] = time.strftime("%m-%d-%Y")

        cwe = []
        try:

            cwe.append(cve_item['vuln:cwe']['@id'])

        except KeyError:
            pass
        except TypeError:
            for cwe_entry in cve_item['vuln:cwe']:
                cwe.append(cwe_entry['@id'])

        cve_entry['cwe_id'] = list(cwe)


        # Fill from references dict
        cve_entry['vulnerability_source'] = ['123', 'abc']
        cve_entry['vulnerability_source_reference'] = ['123', '123ab']

        if cve_item.get('vuln:summary'):
            cve_entry['summary'] = cve_item['vuln:summary']

        # Add dictinoary to CVES list
        cve_entries.append(cve_entry)

    # Return list of dictionaries
    return cve_entries


if __name__ =='__main__':

    cvexmlparser('nvdcve-2.0-recent.xml')
