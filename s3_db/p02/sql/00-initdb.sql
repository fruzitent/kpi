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

-- tables
drop table if exists realtor.appointments;
create table realtor.appointments
(
    appointment_id bigint not null generated always as identity primary key
);

drop table if exists realtor.stats;
create table realtor.stats
(
    created_at  timestamp with time zone not null                          default now(),
    followers   bigint                   not null check (followers >= 0)   default 0,
    impressions bigint                   not null check (impressions >= 0) default 0,
    stat_id     bigint                   not null generated always as identity primary key,
    updated_at  timestamp with time zone not null                          default now()
);

drop table if exists realtor.offers;
create table realtor.offers
(
    offer_id bigint not null generated always as identity primary key,
    stat_id  bigint not null references realtor.stats (stat_id) on delete cascade on update cascade
);

drop table if exists realtor.properties;
create table realtor.properties
(
    property_id bigint not null generated always as identity primary key
);

drop table if exists realtor.apartments;
create table realtor.apartments
(
    property_id bigint not null primary key references realtor.properties (property_id) on delete cascade on update cascade
);

drop table if exists realtor.houses;
create table realtor.houses
(
    property_id bigint not null primary key references realtor.properties (property_id) on delete cascade on update cascade
);

drop table if exists realtor.offices;
create table realtor.offices
(
    property_id bigint not null primary key references realtor.properties (property_id) on delete cascade on update cascade
);

drop table if exists realtor.users;
create table realtor.users
(
    email      text   not null check (length(email) <= 320) unique,
    first_name text   not null check (length(first_name) <= 63),
    last_name  text   not null check (length(last_name) <= 63),
    password   text   not null,
    stat_id    bigint not null references realtor.stats (stat_id) on delete cascade on update cascade,
    user_id    bigint not null generated always as identity primary key
);

drop table if exists realtor.agents;
create table realtor.agents
(
    nar_id  text   not null check (length(nar_id) = 9 and nar_id like '^\d$'),
    user_id bigint not null primary key references realtor.users (user_id) on delete cascade on update cascade
);

drop table if exists realtor.clients;
create table realtor.clients
(
    user_id bigint not null primary key references realtor.users (user_id) on delete cascade on update cascade
);