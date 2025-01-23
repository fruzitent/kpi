drop function if exists realtor.count_offers;
create function realtor.count_offers() returns bigint as
$$
begin
    return (select count(*) from realtor.offer);
end;
$$ language plpgsql;

select realtor.count_offers();
--  count_offers
-- --------------
--           206
-- (1 row)
