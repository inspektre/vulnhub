# Vulnhub
````
 __      __      _         _    _         _
 \ \    / /     | |       | |  | |       | |
  \ \  / /_   _ | | _ __  | |__| | _   _ | |__
   \ \/ /| | | || || '_ \ |  __  || | | || '_ \ 
    \  / | |_| || || | | || |  | || |_| || |_) |
     \/   \__,_||_||_| |_||_|  |_| \__,_||_.__/ 

 ```` 
### A Graph-Native CVE CPE Database
1. Explore CVEs as a natural relationship of weaknesses.
2. Search for hidden patterns from CVEs.


***inspektre Customers***
For `inspektre` customers 
1. CVEs are populated automatically for all `inspektre` customers.
2. This project is a community/free resource.


### Goals
1. Create an open graph-native NVD CVE and CPE Database.
2. Explore NVD CVEs for hidden patterns - Security Research.
3. Classify CVEs into communities.
4. Explore CVEs for similarities and other patterns.

### Setup
`yarn install` or `npm run install` will install all Jaavascript dependencies. Please ensure that `nodev14` or higher is used.

### Neo4J setup
1. For Cloud Deployments - https://neo4j.com/docs/operations-manual/current/cloud-deployments/
2. For DbaaS (Neo4J Aura) - https://neo4j.com/cloud/aura/
3. Neo4J Sandbox - https://neo4j.com/sandbox/
4. Docker - https://neo4j.com/docs/operations-manual/current/docker/
5. Local or Corp Net - https://neo4j.com/docs/operations-manual/current/installation/

### Environment
* vulnhub requires that the database uses transport security. For self-signed certificates, configure database connectionas as `bolt+ssc`.
* Below are a list of environment vairables required for VulnHub.
```
NEO4J_URI=bolt+s://<FQDN_OR_IP>:7687
NEO4J_USER=<neo4j user with Read/Write Privileges>
NEO4J_PASSWORD=<A_GOOD_LONG_RANDOM_PASSWORD>
NEO4J_DATABASE=nvd
```