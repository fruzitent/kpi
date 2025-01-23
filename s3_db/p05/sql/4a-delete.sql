drop function if exists realtor.orphan_client cascade;
create function realtor.orphan_client() returns trigger as
$$
begin
    delete
    from realtor.user
    where user_id = old.client_id;
    return old;
end;
$$ language plpgsql;

drop trigger if exists check_orphans on realtor.client cascade;
create trigger check_orphans
    after delete
    on realtor.client
    for each row
execute function realtor.orphan_client();

do
$$
    declare
        _email   text;
        _user_id bigint;
    begin
        select client_id
        from realtor.client
        order by client_id
        limit 1
        into _user_id;

        delete
        from realtor.client
        where client_id = _user_id;

        select email
        from realtor.user
        where user_id = _user_id
        into _email;
        raise notice 'user_id %: %', _user_id, _email;
--         user_id 2: <NULL>

        rollback;

        select email
        from realtor.user
        where user_id = _user_id
        into _email;
        raise notice 'user_id %: %', _user_id, _email;
--         user_id 2: nona@example.com
    end;
$$ language plpgsql;
