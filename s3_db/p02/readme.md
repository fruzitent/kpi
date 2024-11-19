# s3_db/p02

```shell
cp "./.env.in" "./.env"
just down up logs
docker run --rm -it --network "host" "docker.io/library/postgres:17.1" psql -h "localhost" -U "postgres"
```
