# Usage
---
     vulnhub stats [--vendor] [--product]
     vulnhub search [-c --cpe] [-v --cve] [-y --year] [-j --json] [-l --limit] [--no-limit] <search_term>
     vulnhub populate [-c --cpe] [-v --cve] [-a --all]
     vulnhub update [-v --cve]
     vulnhub config [--generate] [--driver]
     vulnhub dbinit [--no-confirm] [-c --cpe] [-v --cve] [-all]
     vulnhub --version
     vulnhub (-h | --help)
---

# Commands
---
    Commands:
        stats              Display stats on Vulnerable products.
        search             Search NVD database by CPE, CVE or Year.
        populate           Populate Local copy of NVD Database.
        update             Update a specific dictionary
        config             Change configuration.
        dbinit             Initialize database and create tables.
---

# Options
---
    Options:
        -c, --cpe            Search by CPE URI.
        -v, --cve            Search by CVE Identifier.
        -y, --year           Search by Year.
        -j, --json           JSON Output for search results.
        -l, --limit=limit    Limit Search results.
        --no-limit           Get all results without default limit.
        -a --all             Update Both CVE and CPE Dictionaries.
        --no-confirm         Drop database without being asked for confirmation.
        --generate           Generate a new Configuration.
        --driver             Set a new database driver.
        -h --help            vulnhub help and usage.
---
