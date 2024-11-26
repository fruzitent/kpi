-- roles
drop role if exists viewer;
create role viewer;

drop role if exists editor;
create role editor;
grant viewer to editor with inherit true;

drop role if exists owner;
create role owner;
grant editor to owner with inherit true;

-- users
drop user if exists employee_01;
create user employee_01 with password 'pwd!01';
grant editor to employee_01 with inherit true;

drop user if exists employee_02;
create user employee_02 with password 'pwd!02';
grant viewer to employee_02 with inherit true;

-- schema
drop database if exists example;
create database example;
\connect example;

drop schema if exists realtor;
create schema realtor;
set search_path to realtor;

-- permissions
alter default privileges in schema realtor
    grant select on tables to viewer;
grant usage on schema realtor to viewer;

alter default privileges in schema realtor
    grant delete, insert, select, update on tables to editor;

alter default privileges in schema realtor
    grant all privileges on tables to owner;
