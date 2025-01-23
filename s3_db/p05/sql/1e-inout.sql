drop procedure if exists realtor.print_user;
create procedure realtor.print_user(_user_id bigint) as
$$
declare
    _full_name text;
begin
    select first_name || ' ' || last_name
    from realtor.user
    where user_id = _user_id
    into _full_name;

    if _full_name is null then
        raise notice 'user_id %: not found', _user_id;
        return;
    end if;

    raise notice 'user_id %: %', _user_id, _full_name;
end;
$$ language plpgsql;

call realtor.print_user(42);
-- user_id 42: Lorenz Wiegand
