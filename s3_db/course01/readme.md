# s3_db/course01

```shell
$ docker swarm init
$ openssl rand -base64 32 | docker secret create "mariadb_pswd" -
$ openssl rand -base64 32 | docker secret create "mssql_pswd" -
$ openssl rand -base64 32 | docker secret create "psql_pswd" -
$ just deploy
```
