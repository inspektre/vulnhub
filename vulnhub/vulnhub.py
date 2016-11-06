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
  vulnhub config [--generate] [--driver]
  vulnhub dbinit [--no-confirm] [-c --cpe] [-v --cve] [-all]
  vulnhub --version
  vulnhub (-h | --help)

Commands:
    stats              Display stats on Vulnerable products.
    search             Search NVD database by CPE, CVE or Year.
    update             Update Local copy of NVD Database.
    config             Change configuration.
    dbinit             Initialize database and create tables.

Options:
  -c, --cpe            Search by CPE URI.
  -v, --cve            Search by CVE Identifier.
  -y, --year           Search by Year.
  -j, --json           JSON Output for search results.
  -l, --limit=limit    Limit Search results.
  -a --all             Update Both CVE and CPE Dictionaries.
  --no-confirm         Drop database without being asked for confirmation.
  --generate           Generate a new Configuration.
  --driver             Set a new database driver.
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
from . import config



#
def main(sysargv=None):
    """"
    Search query happens this way
        search_vulnerabilities('CVE-2009-2696')
        search_vulnerable_products('cpe:/h:ruckus:wireless_h500:-')
    """
    argv = docopt(
        doc=__doc__.format(os.path.basename(sys.argv[0])),
        argv=sysargv
        )
    search_term = argv['<search_term>']

    # Setting up Default Limit
    search_limit = 5

    try:
        search_limit = int(argv['--limit'])
    except ValueError:
        pass
    except TypeError:
        pass

    if argv['search']:
        if argv['--cpe']:
            sys.stdout.write(queries.search_vulnerable_products(search_term, search_limit))
            sys.stdout.write("\n")
        elif argv['--cve']:
            sys.stdout.write(queries.search_vulnerabilities(search_term, search_limit))
            sys.stdout.write("\n")
        elif argv['--year']:
            try:
                year = int(search_term)
            except ValueError:
                pass
            except TypeError:
                pass
            finally:
                sys.stdout.write(queries.search_by_year(year, search_limit))
                sys.stdout.write("\n")
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
    elif argv['config']:
        if argv['--generate']:
            config.generate_config()
        elif argv['--driver']:
            print("SQL Driver change option is not implemented")
    elif argv['dbinit']:
        if argv['--no-confirm']:
            pass
        else:
            # Post a confirmation before drop
            pass
        if argv['--cpe']:
            queries.drop_cpes()
        elif argv['--cve']:
            queries.drop_cves()
        elif argv['--all']:
            queries.initialize()
        else:
            pass
    elif argv['--help']:
        print(docopt(__doc__))
    else:
        print("[-------------------------]")
        print("[-] please verify usage [-]")
        print("[-------------------------]")
        print(docopt(__doc__))


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))

