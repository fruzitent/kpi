drop procedure if exists realtor.print_gross;
create procedure realtor.print_gross() as
$$
declare
    _gross numeric;
begin
    select sum(o.agent_rate * o.price)
    from realtor.offer o
             join realtor.stat s using (stat_id)
    where o.offer_status = 'finished'
      and s.updated_at > now() - interval '1y'
    into _gross;
    raise notice 'gross revenue this year: %', _gross;
end;
$$ language plpgsql;

call realtor.print_gross();
-- gross revenue this year: 21.8600
