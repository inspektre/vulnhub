"""
Usage:
  vulnhub stats
  vulnhub search [--cpe] [--cve] [--year] <search_term>
  vulnhub (-h | --help)

Commands:
    stats   Display stats on Vulnerable products
    search  Seach NVD database by CPE, CVE or Year

Options:
  --cpe            Search by CPE URI
  --cve            Search by CVE Identifier
  --year            Search by Year
  -h --help     Help Banner for Vulnhub

Report bugs to <skorlimarla@unomaha.edu>
"""

from docopt import docopt
import sys
import os

from . import queries
from . import populate_cpes
from . import populate_cves

def hello(name):
    print('Hello, {0}'.format(name))

def goodbye(name):
    print('bye, {0}'.format(name))

def main(sysargv=None):
    '''
    Search query happens this way
        search_vulnerabilities('CVE-2009-2696')
        search_vulnerable_products('cpe:/h:ruckus:wireless_h500:-')
    '''
    argv = docopt(
        doc=__doc__.format(os.path.basename(sys.argv[0])),
        argv=sysargv
        )
    search_term = argv['<search_term>']

    if argv['search']:
        if argv['--cpe']:
            queries.search_vulnerable_products(search_term)
        elif argv['--cve']:
            populate_cves.start_cve_population()
            #queries.search_vulnerabilities(search_term)
        elif argv['--year']:
            print("year search with {0}".format(search_term))
        else:
            print(__doc__)
    elif argv['stats']:
        print("Generate Stats")
    else:
        print(__doc__)


# Populate CPEs
# populate_cpes.start_cpe_population()

# Populate CVEs
# populate_cves.start_cve_population()

if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))

