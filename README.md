# Vulnhub
````
 __      __      _         _    _         _
 \ \    / /     | |       | |  | |       | |
  \ \  / /_   _ | | _ __  | |__| | _   _ | |__
   \ \/ /| | | || || '_ \ |  __  || | | || '_ \ 
    \  / | |_| || || | | || |  | || |_| || |_) |
     \/   \__,_||_||_| |_||_|  |_| \__,_||_.__/ 

 ```` 
## Getting Started

- To install dependencies, type `yarn run`.
- To run GraphQL Server, type `yarn start`.
- To seed database, type `yarn seed`.

### Environment variables
- Before database seeding, run `export NODE_OPTIONS=--max-old-space-size=4096` to ensure that the memory heap-size is increased.
- Please neo4j bolt with SSL`bolt` url with `NEO4J_ENCRYPTED=true`.
- When `botl+s` is used, remove `NEO4J_ENCRYPTED=true` will be a duplicate setting.
-

```
GRAPHQL_URI=http://localhost:4000
NEO4J_URI=bolt://<host>:<port>
NEO4J_USER=user
NEO4J_PASSWORD=<Make sure your pass phrase is generated & stored safely>
NEO4J_ENCRYPTED=true
NEO4J_DATABASE=neo4j
APOLLO_KEY=<service_key>
AUTH_DIRECTIVES_ROLE_KEY=https://auth.domain/roles
JWT_SECRET="-----BEGIN CERTIFICATE-----\n
<YOUR JWT KEY>
-----END CERTIFICATE-----"
```
