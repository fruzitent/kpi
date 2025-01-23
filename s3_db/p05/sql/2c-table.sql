drop function if exists realtor.get_user_profile;
create function realtor.get_user_profile(_email text)
    returns table
            (
                user_id    bigint,
                first_name text,
                last_name  text
            )
as
$$
begin
    return query (select user_id, first_name, last_name
                  from realtor.user
                  where email = _email);
end;
$$ language plpgsql;

select *
from realtor.get_user_profile('sebastian@example.org');
--  user_id | first_name | last_name
-- ---------+------------+------------
--      209 | Bernhard   | Balistreri
-- (1 row)
