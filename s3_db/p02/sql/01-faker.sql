\connect example;
set search_path to realtor;

-- generate data
alter database example set session_preload_libraries = 'anon';
create extension if not exists anon;
select anon.init();

drop procedure if exists create_location;
create procedure create_location(
    inout __location_id bigint
) as
$$
begin
    insert into realtor.location (city,
                                  country,
                                  postal_code,
                                  street_name)
    values (anon.dummy_city_name(),
            anon.dummy_country_name(),
            anon.dummy_zip_code(),
            anon.dummy_street_name())
    returning location_id into __location_id;
end;
$$ language plpgsql;

drop procedure if exists create_stat;
create procedure create_stat(
    inout __stat_id bigint
) as
$$
declare
    _created_at timestamp with time zone := anon.random_in_tstzrange(tstzrange('1970-01-01', now()));
    _updated_at timestamp with time zone := anon.random_in_tstzrange(tstzrange(_created_at, now()));
begin
    insert into realtor.stat (created_at,
                              followers,
                              impressions,
                              updated_at)
    values (_created_at,
            floor(random() * 32767),
            floor(random() * 32767),
            _updated_at)
    returning stat_id into __stat_id;
end;
$$ language plpgsql;

drop procedure if exists create_property;
create procedure create_property(
    in __location_id bigint,
    inout __property_id bigint
) as
$$
declare
    __property_status realtor.property_status := anon.random_in_enum(null::realtor.property_status);
    __property_type   realtor.property_type   := anon.random_in_enum(null::realtor.property_type);
begin
    insert into realtor.property (location_id,
                                  property_status,
                                  property_type,
                                  total_depth,
                                  total_width)
    values (__location_id,
            __property_status,
            __property_type,
            floor(random() * 127) + 1,
            floor(random() * 127) + 1)
    returning property_id into __property_id;

    case __property_type
        when 'apartment' then insert into realtor.apartment (apartment_id,
                                                             floor,
                                                             rooms)
                              values (__property_id,
                                      floor(random() * 31) + 1,
                                      floor(random() * 7) + 1);
        when 'house' then insert into realtor.house (floor_count,
                                                     house_id)
                          values (floor(random() * 3) + 1,
                                  __property_id);
        else raise 'unknown property_type %', __property_type;
        end case;
end;
$$ language plpgsql;

drop procedure if exists create_document;
create procedure create_document(
    in __property_id bigint,
    inout __document_id bigint
) as
$$
begin
    insert into realtor.document (data,
                                  file_name,
                                  mime_type,
                                  property_id)
    values (md5(random()::text)::bytea,
            anon.dummy_file_name(),
            'application/octet-stream',
            __property_id)
    returning document_id into __document_id;
end;
$$ language plpgsql;

drop procedure if exists create_user;
create procedure create_user(
    in __stat_id bigint,
    inout __user_id bigint
) as
$$
declare
    __user_type realtor.user_type := anon.random_in_enum(null::realtor.user_type);
begin
    insert into realtor.user (email,
                              first_name,
                              last_name,
                              password,
                              stat_id,
                              user_type)
    values (anon.dummy_safe_email(),
            anon.dummy_first_name(),
            anon.dummy_last_name(),
            md5(random()::text),
            __stat_id,
            __user_type)
    returning user_id into __user_id;

    case __user_type
        when 'agent' then insert into realtor.agent (agent_id,
                                                     nar_id)
                          values (__user_id,
                                  lpad((floor(random() * 1e9))::text, 9, '0'));
        when 'client' then insert into realtor.client (client_id)
                           values (__user_id);
        else raise 'unknown user_type %', __user_type;
        end case;
end;
$$ language plpgsql;

drop procedure if exists create_offer;
create procedure create_offer(
    in __property_id bigint,
    in __stat_id bigint,
    inout __offer_id bigint
) as
$$
declare
    __maker_id     bigint;
    __offer_status realtor.offer_status := anon.random_in_enum(null::realtor.offer_status);
    __offer_type   realtor.offer_type   := anon.random_in_enum(null::realtor.offer_type);
    __price        integer;
begin
    __maker_id := (select client_id from realtor.client order by random() limit 1);

    case __offer_type
        when 'tenancy' then __price := floor(random() * 1e3);
        when 'trade' then __price := floor(random() * 1e6);
        else raise 'unknown offer_type %', __offer_type;
        end case;

    insert into realtor.offer (maker_id,
                               offer_status,
                               offer_type,
                               price,
                               property_id,
                               stat_id)
    values (__maker_id,
            __offer_status,
            __offer_type,
            __price,
            __property_id,
            __stat_id)
    returning offer_id into __offer_id;
end;
$$ language plpgsql;

drop procedure if exists create_appointment;
create procedure create_appointment(
    in __offer_id bigint,
    inout __appointment_id bigint
) as
$$
declare
    __appointment_status realtor.appointment_status := anon.random_in_enum(null::realtor.appointment_status);
    __created_at         timestamp with time zone;
    __scheduled_at       tstzrange;
    __updated_at         timestamp with time zone;
begin
    select stat.created_at, stat.updated_at
    into __created_at, __updated_at
    from realtor.offer
             join realtor.stat on offer.stat_id = stat.stat_id
    where offer_id = __offer_id;

    case __appointment_status
        when 'cancelled' then __scheduled_at := tstzrange(__updated_at, now());
        when 'finished' then __scheduled_at := tstzrange(__updated_at, least(__updated_at + interval '1 month', now()));
        when 'scheduled' then __scheduled_at := tstzrange(now(), now() + interval '1 month');
        else raise 'unknown appointment_status: %', __appointment_status;
        end case;

    insert into realtor.appointment (appointment_status,
                                     created_at,
                                     offer_id,
                                     scheduled_at)
    values (anon.random_in_enum(null::realtor.appointment_status),
            anon.random_in_tstzrange(tstzrange(__created_at, __updated_at)),
            __offer_id,
            anon.random_in_tstzrange(__scheduled_at))
    returning appointment_id into __appointment_id;
end;
$$ language plpgsql;

do
$$
    declare
        __appointment_id bigint;
        __document_id    bigint;
        __location_id    bigint;
        __offer_id       bigint;
        __property_id    bigint;
        __stat_id        bigint;
        __user_id        bigint;
    begin
        for i in 1..floor(random() * 1e3)
            loop
                call create_location(__location_id);
                call create_stat(__stat_id);
                call create_property(__location_id, __property_id);

                for i in 1..floor(random() * 10)
                    loop
                        call create_document(__property_id, __document_id);
                    end loop;

                begin
                    call create_user(__stat_id, __user_id);
                exception
                    when unique_violation then
                        continue;
                end;

                if not exists (select * from realtor.client) then
                    continue;
                end if;

                <<__inner>>
                for i in 1..floor(random() * 3)
                    loop
                        call create_offer(__property_id, __stat_id, __offer_id);

                        declare
                            __agent_id     bigint               := (select agent_id from realtor.agent order by random() limit 1);
                            __agent_rate   numeric(5, 4);
                            __offer_status realtor.offer_status := (select offer_status from realtor.offer where offer_id = __offer_id);
                            __offer_type   realtor.offer_type   := (select offer_type from realtor.offer where offer_id = __offer_id);
                        begin
                            if __agent_id is null then
                                continue;
                            end if;

                            if __offer_status in ('draft', 'submitted') then
                                continue __inner;
                            end if;

                            case __offer_type
                                when 'tenancy' then __agent_rate := 0.0200;
                                when 'trade' then __agent_rate := 0.5000;
                                else raise 'unknown offer_type %', __offer_type;
                                end case;

                            update realtor.offer
                            set (agent_id, agent_rate) = (__agent_id, __agent_rate)
                            where offer_id = __offer_id;

                            if __offer_status != 'finished' and random() < 0.5 then
                                continue;
                            end if;

                            if exists (select *
                                       from realtor.appointment
                                       where appointment_status = 'finished'
                                         and offer_id = __offer_id) then
                                continue;
                            end if;

                            update realtor.offer
                            set (taker_id) = ((select (user_id)
                                               from realtor.user
                                               where user_id != __user_id
                                                 and user_type = 'client'
                                               order by random()
                                               limit 1))
                            where offer_id = __offer_id;
                        end;

                        for i in 1..floor(random() * 3)
                            loop
                                call create_appointment(__offer_id, __appointment_id);
                            end loop;
                    end loop;
            end loop;
    end;
$$ language plpgsql;
