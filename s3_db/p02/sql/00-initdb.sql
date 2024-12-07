-- roles

drop role if exists "viewer@iam.example.org";
create role "viewer@iam.example.org";

drop role if exists "editor@iam.example.org";
create role "editor@iam.example.org";
grant "viewer@iam.example.org" to "editor@iam.example.org" with inherit true;

drop role if exists "owner@iam.example.org";
create role "owner@iam.example.org";
grant "editor@iam.example.org" to "owner@iam.example.org" with inherit true;

-- users

drop user if exists "employee-01@example.org";
create user "employee-01@example.org" with password 'pwd!01';
grant "editor@iam.example.org" to "employee-01@example.org" with inherit true;

drop user if exists "employee-02@example.org";
create user "employee-02@example.org" with password 'pwd!02';
grant "viewer@iam.example.org" to "employee-02@example.org" with inherit true;

-- schema

drop database if exists "example.org";
create database "example.org";
\connect "example.org";

drop schema if exists "realtor";
create schema "realtor";
set search_path to "realtor";

create table if not exists "user"
(
);
