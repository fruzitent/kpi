drop procedure if exists realtor.print_total_price;
create procedure realtor.print_total_price(_offer_id bigint) as
$$
declare
    _total_price integer;
begin
    select (agent_rate * price) + price
    from realtor.offer
    where offer_id = _offer_id
    into _total_price;

    if _total_price is not null then
        raise notice 'offer %: total %', _offer_id, _total_price;
    else
        raise notice 'offer %: not found', _offer_id;
    end if;
end;
$$ language plpgsql;

call realtor.print_total_price(37);
-- offer 37: total 113
