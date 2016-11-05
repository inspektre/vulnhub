"""
 --------------------------------------------------
| _      __      _         _    _         _        |
| \ \    / /    | |       | |  | |       | |       |
| \ \  / /_   _ | | _ __  | |__| | _   _ | |__     |
|  \ \/ /| | | || || '_ \ |  __  || | | || '_ \    |
|   \  / | |_| || || | | || |  | || |_| || |_) |   |
|    \/  \__,_||_||_| |_||_|  |_| \__,_||_.__/     |
 ---------------------------------------------------
Usage:
  vulnhub stats
  vulnhub search [-c --cpe] [-v --cve] [-y --year] [-j --json] [-l --limit] <search_term>
  vulnhub update [-c --cpe] [-v --cve] [-a --all]
  vulnhub dbinit [-no--cofirm]
  vulnhub --version
  vulnhub (-h | --help)

Commands:
    stats              Display stats on Vulnerable products.
    search             Search NVD database by CPE, CVE or Year.
    update             Update Local copy of NVD Database.
    dbinit             Initialize database and create tables.

Options:
  -c, --cpe            Search by CPE URI.
  -v, --cve            Search by CVE Identifier.
  -y, --year           Search by Year.
  -j, --json           JSON Output for search results.
  -l, --limit=limit    Limit Search results.
  -a --all             Update Both CVE and CPE Dictionaries.
  --no-confirm         Drop database without being asked for confirmation.
  -h --help            vulnhub help and usage.

Maintainer: Uday Korlimarla
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

    # Setting up Default Limit
    search_limit = 10
    try:
        search_limit = int(argv['--limit'])
    except ValueError:
        pass
    except TypeError:
        pass

    if argv['search']:
        if argv['--cpe']:
            queries.search_vulnerable_products(search_term, search_limit)
        elif argv['--cve']:
            queries.search_vulnerabilities(search_term, search_limit)
        elif argv['--year']:
            try:
                year = int(search_term)
            except ValueError:
                pass
            except TypeError:
                pass
            finally:
                queries.search_by_year(year, search_limit)
        elif argv['--json']:
            print("JSON")
        else:
            print(docopt(__doc__))
    elif argv['stats']:
        print("Generate Stats")
    elif argv['update']:
        if argv['--cpe']:
            print("Populating CPE Dictionary")
            populate_cpes.start_cpe_population()
        elif argv['--cve']:
            print("Populating CPE Dictionary")
            populate_cves.start_cve_population()
        elif argv['--all']:
            print("Populating CVE Dictionary")
            populate_cves.start_cve_population()
            print("Populating CPE Dictionary")
            populate_cpes.start_cpe_population()
        else:
            print(docopt(__doc__))
    elif argv['--help']:
        print(docopt(__doc__))
    else:
        print("[-------------------------]")
        print("[-] please verify usage [-]")
        print("[-------------------------]")
        print(docopt(__doc__))


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))

