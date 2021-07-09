[![CodeQL](https://github.com/inspektre/vulnhub/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/inspektre/vulnhub/actions/workflows/codeql-analysis.yml) 
[![npm](https://github.com/inspektre/vulnhub/actions/workflows/npm-publish.yaml/badge.svg)](https://github.com/inspektre/vulnhub/actions/workflows/npm-publish.yaml)
[![NVD CVE Update](https://github.com/inspektre/vulnhub/actions/workflows/nvd.yml/badge.svg?branch=main)](https://github.com/inspektre/vulnhub/actions/workflows/nvd.yml)

 ```
 __      __      _         _    _         _
 \ \    / /     | |       | |  | |       | |
  \ \  / /_   _ | | _ __  | |__| | _   _ | |__
   \ \/ /| | | || || '_ \ |  __  || | | || '_ \ 
    \  / | |_| || || | | || |  | || |_| || |_) |
     \/   \__,_||_||_| |_||_|  |_| \__,_||_.__/ 

```

 ```(:Attacks)->[:THINK]-(:Graphs)-[:SHOULD_THINK]<-(:Defenders)```

# Known Isssues

When `vulnhub download` command is run, there are two issues identified.NVD 1.1 JSON compressed feeds are downloaded from NIST's NVD (gzip).As each compressed file is downloaded, JSON file is extracted.
- Sometimes, a download may error out with invalid headers check
```
Error: incorrect header check
    at Zlib.zlibOnError [as onerror] (zlib.js:188:17)
```
- Sometimes, NIST downloads timeout, especially when CVE Feeds are repeatedly downloaded.

Until a stable fix can be put in, we have the following recommendations:
1. `vulnhub download` needs to be complete only once successfully. Please retry 3-4 times until you succeed. Do not manually download the CVE Feeds. It is okay to do so, but that defeats the purpose of providing `vulnhub download`.
2. `vulnhub seed` needs to be run only once on a database when `vulnhub download succeeds`.
3. `vulnhub delta` needs to be run when both `vulnhub download` & `vulnhub seed` succeed. Ideal setup is a cronjob to run once every 20 mins.


NVD CVEs in under 60 seconds.

## What is CVE?

Please visit  MITRE at https://cve.mitre.org/ to read more about what CVEs are. Below is a quick gist in two sentences.

- Common vulnerabilities & Exposures (CVEs) is a list of publicly disclosed computer/software/hardware security flaws, including security advisories from vendors. 
- The format is CVE-YYYY-XXXXX and can be interpereted as a sequence in a given year starting from 2002.


## Prerequsities
1. Nodejs v14+
2. Yarn or npm to install JavaScript dependencies.
3. Neo4J Database!

## Getting Started

- To install dependencies, type `yarn run`.
- To run GraphQL Server, type `yarn start`.
- To seed database with CVEs, type `yarn seed`.

## Environment variables
The name of the database can be anything string. However, nvd is the most appropriate.
```
NEO4J_URI=bolt+s://<IP/FQDN>:7687
NEO4J_USER=<username>
NEO4J_PASSWORD=<pwd>
NEO4J_DATABASE=nvd
```

# Why Neo4J

obs=(:Graphs)-[:ARE]-(:Everywhere) RETRUN obs;

Graphs make it more intuitve in searching for patterns, establishing relationships as first-class citizens instead of Foreign Keys Primary Keys. Creating CVE Knowledge Graphs is the goals of this project for collective public benefit.


## Setting up Neo4J Database.
There are many-a-ways for getting started with your neo4j database. Below are recommendations, please choose an option that best suits your needs.

1. Ensure that you have at-least 4 GB of storage with Neo4j Aura (Neo4J DBaaS). Theisfastest way is to get started (https://console.neo4j.io/#databases). As the CVE database is way beyond the free-tier limits. However Aura is reasonably priced.
2. Spin-up a Neo4j community edition server on Azure, AWS or GCP compute.
3. Spin-up a compute on alternate cloud-server providers (upcloud | DO | vultr | linode and etc.).

With options 2 & 3, Please ensure to do the following: (Based on upcloud tests)

- Spin up compute with at-least 16 GB Memory and 4 vCPUs.
- Perform seeding with `yarn seed` (Takes about 45 seconds)
- Spin down the compute and downgrade to at half the capacity for acceptable daily-use.

## Database memory & configuration

Neo4J Memory configurations below are for reference. Overall, having Neo4j (Preferrably any linux distro) with at least 32 GB Memory with 6 vCPUs has significant seeding performance. Additionally, neo4j can be deployed to a kubernetes for theoritical unlimited scalability for your CVE Graphs.
```
dbms.memory.heap.initial_size=1g
dbms.memory.heap.max_size=6g
dbms.memory.pagecache.size=8g
dbms.memory.transaction.global_max_size=4g
dbms.memory.transaction.max_size=2g
```

During seeding, a significant amount of memory is used to quickly create relationships between nodes. Once the seeding is complete, relationships will be continually evaluated for delta and hence our rationale in recommendations to use these 

## Need help?
If you need help with this project, please do create an issue. We will help you on a best-effort basis.


## GraphQL
- The oroginal GraphQL API (neo4j-graphql) has been temprarily removed.
- This project will now use the recently released `@neo4j/graphql` library.

## History

Vulnhub started originally in Nov 2016 as part of a programming-assignment for a job-interview. The interview was successful but the code-base was left abandoned. The whole code-base was over-engineered in Python.There were minor updates between 2017 through 2019. The original database of choise was `postgresql` & `python` with SQLAlchemy as the ORM. NodeJS, GraphQL and Neo4j (Based off grand-stack) were introduced in 2020. 


**Special** note of thanks.
[Adam Heczko](https://github.com/miradam) helped restore ownership in 2019. The repository is now back to the right owner and is being maintained under the Aegis of inspektre.
