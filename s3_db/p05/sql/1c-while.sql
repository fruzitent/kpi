drop procedure if exists realtor.adjust_for_inflation;
create procedure realtor.adjust_for_inflation(rate numeric(5, 4)) as
$$
declare
    _batch_size bigint := 1024;
    _offset     bigint := 0;
begin
    loop
        update realtor.offer
        set price = ceil(price * rate)
        where offer_id in (select offer_id
                           from realtor.offer
                           offset _offset limit _batch_size);
        _offset := _offset + _batch_size;
        exit when not found;
    end loop;
end;
$$ language plpgsql;

select offer_id, price
from realtor.offer
order by price;
--  offer_id |  price
-- ----------+---------
--       177 |       2
--       168 |      13
--        66 |      16
--        67 |      28
--        99 |      33
--         2 |      42
--       190 |      42
--       122 |      48
--        15 |      49
--       206 |      53
-- ...
-- (206 rows)

call realtor.adjust_for_inflation(1.0400);

select offer_id, price
from realtor.offer
order by price;
--  offer_id |  price
-- ----------+---------
--       177 |       3
--       168 |      14
--        66 |      17
--        67 |      30
--        99 |      35
--         2 |      44
--       190 |      44
--       122 |      50
--        15 |      51
--       206 |      56
-- ...
-- (206 rows)
