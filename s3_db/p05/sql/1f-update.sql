drop procedure if exists realtor.update_offer;
create procedure realtor.update_offer(_id bigint, _status realtor.offer_status) as
$$
begin
    update realtor.offer
    set offer_status = _status
    where offer_id = _id;

    update realtor.stat
    set updated_at = now()
    where stat_id = (select stat_id from realtor.offer where offer_id = _id);
end;
$$ language plpgsql;

call realtor.update_offer(42, 'submitted');

select o.offer_id, o.offer_status, s.updated_at
from realtor.offer o
         join realtor.stat s using (stat_id)
where o.offer_id = 42;
--  offer_id | offer_status |          updated_at
-- ----------+--------------+-------------------------------
--        42 | submitted    | 2025-01-22 07:58:04.071301+00
-- (1 row)

call realtor.update_offer(42, 'rejected');

select o.offer_id, o.offer_status, s.updated_at
from realtor.offer o
         join realtor.stat s using (stat_id)
where o.offer_id = 42;
--  offer_id | offer_status |          updated_at
-- ----------+--------------+-------------------------------
--        42 | rejected     | 2025-01-22 07:58:04.083295+00
-- (1 row)
