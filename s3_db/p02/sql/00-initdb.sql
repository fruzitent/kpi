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
grant usage on schema realtor to viewer;

alter default privileges in schema realtor
    grant select on tables to viewer;

alter default privileges in schema realtor
    grant delete, insert, update on tables to editor;

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

drop type if exists realtor.property_type;
create type realtor.property_type as enum (
    'apartment',
    'house'
    );

drop table if exists realtor.property;
create table realtor.property
(
    property_id     bigint                  not null generated always as identity unique,
    property_type   realtor.property_type   not null,
    primary key (property_id, property_type),

    location_id     bigint                  not null unique references realtor.location (location_id) on delete cascade on update cascade,
    property_status realtor.property_status not null,
    total_depth     integer                 not null check (total_depth > 0),
    total_height    integer check (total_height > 0),
    total_width     integer                 not null check (total_width > 0)
);

drop table if exists realtor.apartment;
create table realtor.apartment
(
    apartment_id   bigint                not null unique,
    apartment_type realtor.property_type not null check (apartment_type = 'apartment') default 'apartment',
    foreign key (apartment_id, apartment_type) references realtor.property (property_id, property_type) on delete cascade on update cascade,
    primary key (apartment_id, apartment_type),

    floor          integer               not null check (floor > 0),
    room_count     integer               not null check (room_count > 0)
);

drop table if exists realtor.house;
create table realtor.house
(
    house_id     bigint                not null unique,
    house_type   realtor.property_type not null check (house_type = 'house') default 'house',
    foreign key (house_id, house_type) references realtor.property (property_id, property_type) on delete cascade on update cascade,
    primary key (house_id, house_type),

    built_at     timestamp with time zone,
    floor_count  integer               not null check (floor_count > 0),
    has_basement boolean,
    has_garage   boolean
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

drop type if exists realtor.user_type;
create type realtor.user_type as enum (
    'agent',
    'client'
    );

drop table if exists realtor.user;
create table realtor.user
(
    user_id    bigint            not null generated always as identity unique,
    user_type  realtor.user_type not null,
    primary key (user_id, user_type),

    email      text              not null check (length(email) <= 320) unique,
    first_name text              not null check (length(first_name) <= 63),
    last_name  text              not null check (length(last_name) <= 63),
    password   text              not null,
    stat_id    bigint            not null references realtor.stat (stat_id) on delete cascade on update cascade
);

drop table if exists realtor.agent;
create table realtor.agent
(
    agent_id   bigint            not null unique,
    agent_type realtor.user_type not null check (agent_type = 'agent') default 'agent',
    foreign key (agent_id, agent_type) references realtor.user (user_id, user_type) on delete cascade on update cascade,
    primary key (agent_id, agent_type),

    nar_id     text              not null check (length(nar_id) = 9 and nar_id ~ '^[0-9]+$')
);

drop table if exists realtor.client;
create table realtor.client
(
    client_id   bigint            not null unique,
    client_type realtor.user_type not null check (client_type = 'client') default 'client',
    foreign key (client_id, client_type) references realtor.user (user_id, user_type) on delete cascade on update cascade,
    primary key (client_id, client_type)
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

drop type if exists realtor.offer_type;
create type realtor.offer_type as enum (
    'tenancy',
    'trade'
    );

drop table if exists realtor.offer;
create table realtor.offer
(
    offer_id     bigint               not null generated always as identity unique,
    offer_type   realtor.offer_type   not null,
    primary key (offer_id, offer_type),

    agent_id     bigint references realtor.agent (agent_id) on delete cascade on update cascade,
    agent_rate   numeric(5, 4) check (0 <= agent_rate and agent_rate <= 1),
    maker_id     bigint               not null references realtor.client (client_id) on delete cascade on update cascade,
    offer_status realtor.offer_status not null default 'draft',
    price        integer              not null check (price >= 0),
    property_id  bigint               not null references realtor.property (property_id) on delete cascade on update cascade,
    stat_id      bigint               not null references realtor.stat (stat_id) on delete cascade on update cascade,
    taker_id     bigint references realtor.client (client_id) on delete cascade on update cascade
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

-- migrations
alter table realtor.agent
    add constraint agent_nar_id_key unique (nar_id);

alter table realtor.apartment
    rename column room_count to rooms;

alter table realtor.appointment
    add column created_at timestamp with time zone not null default now();

alter table realtor.house
    drop column has_basement;

alter table realtor.house
    alter column built_at type date;
