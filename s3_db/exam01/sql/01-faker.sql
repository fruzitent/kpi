alter database postgres set session_preload_libraries = 'anon';
create extension if not exists anon;
select anon.init();

do
$$
declare
    _member_id bigint;
    _team_id bigint;
begin
    insert into public.member
    (date_of_birth, first_name, last_name, user_name)
    values (now(), 'User', 'A', 'user_a')
    returning member_id into _member_id;

    insert into public.team
    (description, team_name)
    values (null, 'team_a')
    returning team_id into _team_id;

    insert into public.member_team
    (member_id, team_id)
    values (_member_id, _team_id);

end;
$$ language plpgsql;

insert into public.game
(game_id, game_name, max_players, min_players)
values
( 1, 'Call of Duty',      1, 1),
( 2, 'Counter-Strike',    1, 1),
( 3, 'Dota',              1, 1),
( 4, 'EA Sports',         1, 1),
( 5, 'Fortnite',          1, 1),
( 6, 'Hearthstone',       1, 1),
( 7, 'League of Legends', 1, 1),
( 8, 'Marvel Rivals',     1, 1),
( 9, 'Minecraft',         1, 1),
(10, 'Overwatch',         1, 1),
(11, 'PUBG',              1, 1),
(12, 'Party Animals',     1, 1),
(13, 'Rust',              1, 1),
(14, 'Street Fighter',    1, 1),
(15, 'THE FINALS',        1, 1),
(16, 'Trackmania',        1, 1),
(17, 'VALORANT',          1, 1);

insert into public.event
(event_name ,game_id ,location ,scheduled_at, url)
values
('PUBG Race on Twitch Rivals',                                 11, 'North America, LATAM, Europe', 'November 22, 2024 10:30 pm GMT+2', 'https://schedule.twitchrivals.com/events/pubg-race-on-twitch-rivals-1WylA'),
('Block Wars: Charity Challenge on Twitch Rivals',              9, 'North America',                'December  4, 2024 12:00 am GMT+2', 'https://schedule.twitchrivals.com/events/block-wars-charity-challenge-on-twitch-rivals-RVAJE'),
('Rust Team Battle V on Twitch Rivals',                        13, 'Europe, North America, LATAM', 'December  9, 2024  9:00 pm GMT+2', 'https://schedule.twitchrivals.com/events/rust-team-battle-v-on-twitch-rivals-lkKoK'),
('EA SPORTS College Football 25 Runback on Twitch Rivals',      4, 'North America',                'January  16, 2025 12:00 am GMT+2', 'https://schedule.twitchrivals.com/events/ea-sports-college-football-25-runback-on-twitch-rivals-a0P56'),
('Marvel Rivals Showdown on Twitch Rivals',                     8, 'North America',                'January  19, 2025 12:00 am GMT+2', 'https://schedule.twitchrivals.com/events/marvel-rivals-showdown-on-twitch-rivals-kmJy1'),
('PUBG Sanhok Destruction on Twitch Rivals',                   11, 'North America, Europe, LATAM', 'January  25, 2025 12:00 am GMT+2', 'https://schedule.twitchrivals.com/events/pubg-sanhok-destruction-on-twitch-rivals-x5rpz'),
('Trackmania Puzzlemania presented by Honda on Twitch Rivals', 16, 'North America, Europe, LATAM', 'January  27, 2025  9:00 pm GMT+2', 'https://schedule.twitchrivals.com/events/trackmania-puzzlemania-presented-by-honda-on-twitch-rivals-lkgqW');
