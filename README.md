````
                                                 __      __      _         _    _         _
                                                 \ \    / /     | |       | |  | |       | |
                                                  \ \  / /_   _ | | _ __  | |__| | _   _ | |__
                                                   \ \/ /| | | || || '_ \ |  __  || | | || '_ \ 
                                                    \  / | |_| || || | | || |  | || |_| || |_) |
                                                     \/   \__,_||_||_| |_||_|  |_| \__,_||_.__/ 
                                                                                                
 ````                                               
[![Build Status](https://travis-ci.org/UShan89/vulnhub.svg?branch=master)](https://travis-ci.org/UShan89/vulnhub)

# vulnhub
Search National Vulnerability Database (NVD) locally for Vulnerabilities (CVEs) and Vulnerable packages (CPEs)

## Language & Requirements
   * Python 3.5.2 (Tested on Ubuntu 16:04)
   * Postgres 9.6 (Docker image or Local development server)

## License & Contributions


   [**vulnhub is licensed under GNU GPL-2.0**](https://raw.githubusercontent.com/UShan89/vulnhub/master/LICENSE)
   [**Easy to read License Information is available here**](https://tldrlegal.com/license/gnu-general-public-license-v2)
   Contributions will be accepted as pull requests.
   Report bugs by creating new issue.

# Installation


   * Step1: Install external dependencies (#Dependencies)
   * `libpq-dev` `libxml2-dev` `libxslt-dev` are the required dependencies.
   * (Optional) If `pip3` is not installed, installed pip3 with `apt-get install python3-pip`
   * Python dependencies are installed automatically
   * To install:
	    1. Clone repository `git clone https://github.com/UShan89/vulnhub vulnhub`
	    2. Change directory to vulnhub `cd vulnhub`
	    3. Install vulnhub with pip `pip3 install .` (using python3-pip)

# configuration

   * Initial setup requires the following configuration
        * Create a directory `.vulnhub` in the user root directory and navigate to the directory.
            * Instance: If root is `/home/ushan`, then the directory of interest is `/home/ushan/.vulnhub`
        * Create a Configuration JSON File as below with appropriate changes. Save the file as `dbconfig.json`.
        
        
             {
                "DATABASE": {
                                "drivername": "postgres",
                                "host": "localhost",
                                "port": "5432",
                                "username": "postgres",
                                "password": "password",
                                "database": "nvddb"
                             }
              }
        
        
# Usage

   Seach Options
        Use `vulnhub search --cve <CVEID>` to search NVD by CVE
        Use `vulnhub search --cpe <cpeid>` to search NVD by CPE
        Use `vulnhub search --year <year>` to search for vulnerabilities by year
        Use `vulnhub stats` to Observe stats

   Default Search Result Limit
        Default Search limit is set to 10. `--limit=<integer>` can be used to increase or decrease search result limit.
# Database


   Step 1: Install docker 
   [**Visit Docker installation instructions**](http://www.docker.com/products/overview) 
   Pull postgres docker image
        `docker pull postgres:latest`
   Start postgres container
        `docker run --rm -e POSTGRES_PASSWORD=password -p 5432:5432 --name nvd_instance postgres`
        `--rm` option Automatically remove the container when it exits
        `-p 5432:5432` is portmapping as `<docker_host_port>:<container_port>`
        `-e` Option is to enable a password. Change `password` to a value of choice (Recommended)
        `--name` option sets friendly name for the container


# NVD Data


   * CPE
        * CPE version 2.3 is used
        * CPE version 2.2 is used for backward compatibility with CVEs.
        * Vendor, Product and Version information is saved for each CPE
        * CPEs are classified into three categories
            * `a - application`
            * `h - Hardware/Firmware`
            * `o - Operating System`
        * Pro   duct URLs
            * A CPE product reference (Change Log) from vendor site is saved.
            * Not All CPEs have a product reference.
            * This field is Optional
         * Product Text
            * Product text is a simple description of a CPE as vendor, product and version.
            * Not all CPEs have text field.
            * This field is optional.
        * Parsing & Populating
            * Official CPE 2.3 dictinary is parsed with xmltodict.
            * [**Parsing fails on Windows - PIP Reference**](https://github.com/pypa/pip/issues/3992)
            * CPE parsing limits platform to Linux and has been tested on Ubuntu 16:04.
            * Postgres bulk insert option is used to populate the database with CPEs.
     
   * CVE
        * CVE Identifier is saved. CVE 2.0 dictionaries are used.
        * Accompanying CVE Information is saved.
            * Vulnerability Summary (Vulnerability Information Text) is saved as Summary.
            * CWE (Software Weakness Identifier) is saved.
            * CVSS Base Score & CIA metrics are saved.
            * Published and Modified dates are saved.
            * Vulnerability Source and Source References are saved.
            * CPEs assocaited with a CVE are saved into an array (Python List)
        * Parsing and Populating
            * xmltodict python Library is used to parse all CVE XML dictionaries.
            * CVE feeds are spidered from NVD Feeds and zipped (*.zip) versions are used instead of gunzip (*.gz) formats.
            * CVEs are populated from the last known year to the latest year as the order.
            * Postgres bulk insert option is used to populate the database with CVEs.


# Dependencies


   * The Following are External dependencies (Ubuntu)
        * libpq-dev (Client library for Postgres).
        * libxml2-dev are libxslt-dev Python lxml parser dependencies.

   * The following Python dependencies are used (Immediate dependencies)
        * wget (Download files from remote locations)
        * sqlalchemy (Python ORM for database agnostic CRUD operations)
        * psycopg2 (PostgreSQL adapter for Python)
        * docopt (Command Line Options)
        * xmltodict (Parse XML)
        * plotly (Generate Plots and Graphs)
    
          
        
