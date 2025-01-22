drop procedure if exists realtor.print_offer;
create procedure realtor.print_offer(_id bigint) as
$$
declare
    _it record;
begin
    select o.offer_id,
           a.appointment_status,
           a.scheduled_at,
           p.property_id,
           p.property_status,
           s.created_at
    from realtor.offer o
             join realtor.appointment a using (offer_id)
             join realtor.property p using (property_id)
             join realtor.stat s using (stat_id)
    where o.offer_id = _id
    into _it;
    raise notice '%', _it;
end;
$$ language plpgsql;

call realtor.print_offer(37);
-- (37,scheduled,"2024-07-18 17:38:58.053936+00",34,fair,"2005-07-16 23:02:08.727798+00")
