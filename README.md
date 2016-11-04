````
 __      __      _         _    _         _
 \ \    / /     | |       | |  | |       | |
  \ \  / /_   _ | | _ __  | |__| | _   _ | |__
   \ \/ /| | | || || '_ \ |  __  || | | || '_ \ 
    \  / | |_| || || | | || |  | || |_| || |_) |
     \/   \__,_||_||_| |_||_|  |_| \__,_||_.__/ 
                                                
 ````                                               

# vulnhub
Search NVD locally

# License & Contributions

---
    * [vulnhub is licensed under GNU GPL-2.0] (https://raw.githubusercontent.com/UShan89/vulnhub/master/LICENSE)
    * [Easy to read License Information is available here] (https://tldrlegal.com/license/gnu-general-public-license-v2)
    * Contributions will be accepted as pull requests.
    * Report bugs by creating new issue.
---
# Usage

# Database

---
    * Step 1: Install docker 
        * [Visit Docker installation instructions]  (http://www.docker.com/products/overview) 
    * Pull postgres docker image
        * `docker pull postgres:latest`
    * Start postgres container
        * `docker run --rm -e POSTGRES_PASSWORD=password -p 5432:5432 --name nvd_instance postgres`
        * `--rm` option removes existing postgres container with `nvd_instance` as container friendly name
        * `-p 5432:5432` is portmapping as `<docker_host_port>:<container_port>`
        * `-e` Option is to enable a password. Change `password` to a value of choice (Recommended)
        * `--name` option sets friendly name for the container
---

# NVD Data

---
    * CPE
        * CPE version 2.3 is used
        * CPE version 2.2 is used for backward compatibility with CVEs.
        * Vendor, Product and Version information is saved for each CPE
        * CPEs are classified into three categories
            * `a - application`
            * `h - Hardware/Firmware`
            * `o - Operating System`
        * Product URLs
            * A CPE product reference (Change Log) from vendor site is saved.
            * Not All CPEs have a product reference.
            * This field is Optional
         * Product Text
            * Product text is a simple description of a CPE as vendor, product and version.
            * Not all CPEs have text field.
            * This field is optional.
        * Parsing & Populating
            * Official CPE 2.3 dictinary is parsed with xmltodict.
            * [Parsing fails on Windows - PIP Reference] (https://github.com/pypa/pip/issues/3992)
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
---

# Dependencies
---
    
          
            
     
