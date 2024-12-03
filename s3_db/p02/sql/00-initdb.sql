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
drop table if exists realtor.location;
create table realtor.location
(
    city          text   not null check (length(city) <= 63),
    country       text   not null check (length(country) <= 63),
    county        text check (length(county) <= 63),
    district      text check (length(district) <= 63),
    location_id   bigint not null generated always as identity primary key,
    postal_code   text   not null check (length(postal_code) <= 15),
    street_name   text   not null check (length(street_name) <= 63),
    street_number text check (length(street_number) <= 15)
);

drop table if exists realtor.stat;
create table realtor.stat
(
    created_at  timestamp with time zone not null                          default now(),
    followers   integer                  not null check (followers >= 0)   default 0,
    impressions integer                  not null check (impressions >= 0) default 0,
    stat_id     bigint                   not null generated always as identity primary key,
    updated_at  timestamp with time zone not null                          default now()
);

drop type if exists realtor.property_status;
create type realtor.property_status as enum (
    'average',
    'excellent',
    'fair',
    'good',
    'poor'
    );

drop table if exists realtor.property;
create table realtor.property
(
    location_id     bigint                  not null unique references realtor.location (location_id) on delete cascade on update cascade,
    property_id     bigint                  not null generated always as identity primary key,
    property_status realtor.property_status not null,
    total_depth     integer                 not null check (total_depth > 0),
    total_height    integer check (total_height > 0),
    total_width     integer                 not null check (total_width > 0)
);

drop table if exists realtor.apartment;
create table realtor.apartment
(
    apartment_id bigint  not null generated always as identity primary key,
    floor        integer not null check (floor > 0),
    property_id  bigint  not null unique references realtor.property (property_id) on delete cascade on update cascade,
    room_count   integer not null check (room_count > 0)
);

drop table if exists realtor.house;
create table realtor.house
(
    built_at     timestamp with time zone,
    floor_count  integer not null check (floor_count > 0),
    has_basement boolean,
    has_garage   boolean,
    house_id     bigint  not null generated always as identity primary key,
    property_id  bigint  not null unique references realtor.property (property_id) on delete cascade on update cascade
);

drop table if exists realtor.document;
create table realtor.document
(
    data        bytea  not null,
    document_id bigint not null generated always as identity primary key,
    file_name   text   not null check (length(file_name) <= 255),
    mime_type   text   not null check (length(mime_type) <= 63),
    property_id bigint not null references realtor.property (property_id) on delete cascade on update cascade
);

drop table if exists realtor.user;
create table realtor.user
(
    email      text   not null check (length(email) <= 320) unique,
    first_name text   not null check (length(first_name) <= 63),
    last_name  text   not null check (length(last_name) <= 63),
    password   text   not null,
    stat_id    bigint not null references realtor.stat (stat_id) on delete cascade on update cascade,
    user_id    bigint not null generated always as identity primary key
);

drop table if exists realtor.agent;
create table realtor.agent
(
    agent_id bigint not null generated always as identity primary key,
    nar_id   text   not null check (length(nar_id) = 9 and nar_id ~ '^[0-9]+$'),
    user_id  bigint not null unique references realtor.user (user_id) on delete cascade on update cascade
);

drop table if exists realtor.client;
create table realtor.client
(
    client_id bigint not null generated always as identity primary key,
    user_id   bigint not null unique references realtor.user (user_id) on delete cascade on update cascade
);

drop type if exists realtor.offer_status;
create type realtor.offer_status as enum (
    'accepted',
    'cancelled',
    'draft',
    'finished',
    'rejected',
    'submitted'
    );

drop table if exists realtor.offer;
create table realtor.offer
(
    agent_id     bigint references realtor.agent (user_id) on delete cascade on update cascade,
    agent_rate   numeric(5, 4) check (0 <= agent_rate and agent_rate <= 1),
    maker_id     bigint               not null references realtor.client (user_id) on delete cascade on update cascade,
    offer_id     bigint               not null generated always as identity primary key,
    offer_status realtor.offer_status not null default 'draft',
    property_id  bigint               not null references realtor.property (property_id) on delete cascade on update cascade,
    stat_id      bigint               not null references realtor.stat (stat_id) on delete cascade on update cascade,
    taker_id     bigint references realtor.client (user_id) on delete cascade on update cascade
);

drop table if exists realtor.tenancy;
create table realtor.tenancy
(
    monthly_price integer not null check (monthly_price >= 0),
    offer_id      bigint  not null unique references realtor.offer (offer_id) on delete cascade on update cascade,
    tenancy_id    bigint  not null generated always as identity primary key
);

drop table if exists realtor.trade;
create table realtor.trade
(
    offer_id    bigint  not null unique references realtor.offer (offer_id) on delete cascade on update cascade,
    total_price integer not null check (total_price >= 0),
    trade_id    bigint  not null generated always as identity primary key
);

drop type if exists realtor.appointment_status;
create type realtor.appointment_status as enum (
    'cancelled',
    'finished',
    'scheduled'
    );

drop table if exists realtor.appointment;
create table realtor.appointment
(
    appointment_id     bigint                     not null generated always as identity primary key,
    appointment_status realtor.appointment_status not null,
    offer_id           bigint                     not null references realtor.offer (offer_id) on delete cascade on update cascade,
    scheduled_at       timestamp with time zone   not null
);
