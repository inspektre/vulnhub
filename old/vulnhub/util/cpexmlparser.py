# -*- coding: utf-8 -*-
"""CPE XML Parser
    This module parses NVD CPE XML feed and returns a list of dictionaries with CPE URI Information
"""


import xmltodict


def cpexmlparser(cpexmlfile):
    """
    Parse NVD CPE XML file and return list of CPE URI dictionaries with CPE Elements
    :param cpexmlfile: CPE Feed XML file (Relative or absolute path)
    :return: List of dictionaries
    """
    xmldoc = open(cpexmlfile, 'r')
    xmlcont = xmldoc.read()
    xmldoc.close()
    tree = xmltodict.parse(xmlcont)
    cpe_entries = []
    for cpe_item in tree['cpe-list']['cpe-item']:
        cpe_entry = dict()
        cpe_entry['cpeid'] = str(cpe_item['@name'])

        cpe_entry['cpetext'] = ''
        # CPE Text
        try:
            if cpe_item['title'].get('#text'):
                cpe_entry['cpetext'] = str(cpe_item['title']['#text'])
        except UnicodeEncodeError:
            pass
        except AttributeError:
            pass

        cpe_entry['cpe_2_3'] = str(cpe_item['cpe-23:cpe23-item']['@name'])

        cpe_classification = {'a': 'application', 'o': 'Operating System', 'h': 'hardware/firware'}

        cpe_text = cpe_entry['cpe_2_3'].split(":")

        cpe_entry['classification'] = cpe_classification[cpe_text[2]]
        cpe_entry['vendor'] = cpe_text[3]
        cpe_entry['product'] = cpe_text[4]
        cpe_entry['version'] = cpe_text[5]

        # CPE Product URL
        cpe_entry['product_ref'] = ''
        if cpe_item.get('references') and cpe_item['references'].get('reference'):
            try:
                cpe_entry['product_ref'] = cpe_item['references']['reference'][0]['@href']

            # Handle non-existing references
            except KeyError:
                pass
            except TypeError:
                pass
        else:
            pass

        # Accumlate entries
        cpe_entries.append(cpe_entry)

    # Return CPE dictionary as iterable
    return cpe_entries
