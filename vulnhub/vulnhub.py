'''Usage:
    ---------------------------------------------------------
    ----------------------VULNHUB ---------------------------
    ---------------------------------------------------------
    Search for Vulnerabilities or vulnerable products by IDs
    ---------------------------------------------------------
        cve <CVEID>
        cpe <CPEID>

Arguments:
  cve    Search by CVE ID
  cpe    Search by CPE ID

Options:
  -c --cve
  -p --cpe

Report bugs to <skorlimarla@unomaha.edu>.
'''

from docopt import docopt
import sys
from queries import search_vulnerabilities
from queries import search_vulnerable_products
from queries import search_by_year


def main(option, searchtext):
    '''
    Search query happens this way
        search_vulnerabilities('CVE-2009-2696')
        search_vulnerable_products('cpe:/h:ruckus:wireless_h500:-')
    '''
    if option == 'c':
        search_vulnerabilities(searchtext)
    elif option == 'p':
        search_vulnerable_products(searchtext)
    elif option == 'y':
        search_by_year(searchtext)
    else:
        arguments = docopt(__doc__)
        print(arguments)


if __name__ == '__main__':
    option = ''.join(sys.argv[1:2]).strip('-')
    searchtext = ''.join(sys.argv[2:3])
    main(option, searchtext)


