drop procedure if exists realtor.process_offers;
create procedure realtor.process_offers() as
$$
declare
    _cursor cursor for select offer_id, offer_status
                       from realtor.offer;
    _offer record;
begin
    open _cursor;

    loop
        fetch _cursor into _offer;
        exit when not found;
        raise notice 'offer_id: %, offer_status: %', _offer.offer_id, _offer.offer_status;
    end loop;

    close _cursor;
end;
$$ language plpgsql;

call realtor.process_offers();
-- offer_id: 1, offer_status: rejected
-- offer_id: 2, offer_status: accepted
-- offer_id: 3, offer_status: submitted
-- offer_id: 4, offer_status: finished
-- offer_id: 42, offer_status: rejected
-- offer_id: 5, offer_status: rejected
-- offer_id: 6, offer_status: finished
-- offer_id: 7, offer_status: rejected
-- offer_id: 8, offer_status: finished
-- offer_id: 9, offer_status: cancelled
-- ...
