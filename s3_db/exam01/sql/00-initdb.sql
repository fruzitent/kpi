-- TODO: verify all members are 18+
-- TODO: verify member represents only 1 team at a time
drop table if exists public.member;
create table public.member (
    date_of_birth timestamp with time zone not null,
    first_name text not null,
    last_name text not null,
    member_id bigint not null generated always as identity primary key,
    user_name text not null unique
);

drop table if exists public.team;
create table public.team (
    description text check (length(description) <= 1023),
    team_id bigint not null generated always as identity primary key,
    team_name text not null
);

drop table if exists public.member_team;
create table public.member_team (
    member_id bigint not null references public.member (member_id) on delete cascade,
    team_id bigint not null references public.team (team_id) on delete cascade,
    primary key (member_id, team_id)
);

-- TODO: verify 2^n teams
drop table if exists public.game;
create table public.game (
    game_id bigint not null generated always as identity primary key,
    game_name text not null,
    max_players bigint not null default 1,
    min_players bigint not null default 1
);

drop table if exists public.event;
create table public.event (
    event_id bigint not null generated always as identity primary key,
    event_name text not null,
    game_id bigint not null references public.game (game_id) no delete cascade,
    location text not null, -- TODO: PostGIS
    scheduled_at timestamp with time zone not null,
    url text
);

drop type if exists public.bracket;
create type public.bracket as enum (
    'loser',
    'winner'
);

drop table if exists public.match;
create table public.match (
    bracket bracket not null,
    event_id bigint not null,
    match_id bigint not null generated always as identity primary key
);

drop table if exists public.schedule;
create table public.schedule (
     schedule_id bigint not null generated always as identity primary key
);

drop type if exists public.penalty;
create type public.penalty as enum (
    'foo',
    'bar',
    'baz'
);

drop function if exists public.trigger_00 cascade;
create function public.trigger_00 as
$$
begin
end;
$$ language plpgsql;

drop trigger if exists check_trigger_00 on public.member cascade;
create trigger check_trigger_00
    before insert or update
    on public.member
    for each row
execute function public.trigger_00();

drop function if exists public.trigger_01 cascade;
create function public.trigger_01 as
$$
begin
end;
$$ language plpgsql;

drop trigger if exists check_trigger_01 on public.member cascade;
create trigger check_trigger_01
    before insert or update
    on public.member
    for each row
execute function public.trigger_01();

drop function if exists trigger_02 cascade;
create function trigger_02 as
$$
begin
end;
$$ language plpgsql;

drop trigger if exists check_trigger_02 on public.member cascade;
create trigger check_trigger_02
    after delete
    on public.member
    for each row
execute function public.trigger_02();
