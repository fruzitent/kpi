drop table if exists kv_map;
create temporary table kv_map
(
    property_id bigint,
    user_id     bigint
);

drop procedure if exists realtor.cache_visit;
create procedure realtor.cache_visit() as
$$
begin
    insert into kv_map
    select p.property_id,
           u.user_id
    from realtor.offer o
             join realtor.property p using (property_id)
             join realtor.user u on u.user_id = o.taker_id
    order by random()
    limit 1;
end;
$$ language plpgsql;

do
$$
    declare
        it record;
    begin
        for i in 1..10
            loop
                call realtor.cache_visit();
            end loop;

        for it in select * from kv_map
            loop
                raise notice 'property_id: %, user_id: %', it.property_id, it.user_id;
            end loop;
    end;
$$ language plpgsql;
-- property_id: 86, user_id: 41
-- property_id: 35, user_id: 11
-- property_id: 152, user_id: 35
-- property_id: 97, user_id: 76
-- property_id: 89, user_id: 47
-- property_id: 59, user_id: 11
-- property_id: 154, user_id: 7
-- property_id: 123, user_id: 28
-- property_id: 112, user_id: 75
-- property_id: 76, user_id: 66
