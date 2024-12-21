# s3_db/course01

## Bootstrap

```shell
$ docker swarm init
$ openssl rand -base64 32 | docker secret create "mariadb_pswd" -
$ openssl rand -base64 32 | docker secret create "mssql_pswd" -
$ openssl rand -base64 32 | docker secret create "psql_pswd" -
$ just deploy
```

## Connect

```shell
$ mariadb --password "<mariadb_pswd>" --user "root"
$ /opt/mssql-tools18/bin/sqlcmd -C -P "<mssql_pswd>" -U "sa"
$ PGPASSWORD="<psql_pswd>" psql --username "postgres"
```
