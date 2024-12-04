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
    __property_type realtor.property_type;
begin
    insert into realtor.property (location_id,
                                  property_status,
                                  property_type,
                                  total_depth,
                                  total_width)
    values (__location_id,
            anon.random_in_enum(null::realtor.property_status),
            anon.random_in_enum(null::realtor.property_type),
            floor(random() * 127) + 1,
            floor(random() * 127) + 1)
    returning property_id into __property_id;

    select property_type
    into __property_type
    from realtor.property
    where property_id = __property_id;

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
    __user_type realtor.user_type;
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
            anon.random_in_enum(null::realtor.user_type))
    returning user_id into __user_id;

    select user_type
    into __user_type
    from realtor.user
    where user_id = __user_id;

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
    __offer_type realtor.offer_type;
begin
    insert into realtor.offer (maker_id,
                               offer_status,
                               offer_type,
                               property_id,
                               stat_id)
    values ((select client_id from realtor.client order by random() limit 1),
            anon.random_in_enum(null::realtor.offer_status),
            anon.random_in_enum(null::realtor.offer_type),
            __property_id,
            __stat_id)
    returning offer_id into __offer_id;

    select offer_type
    into __offer_type
    from realtor.offer
    where offer_id = __offer_id;

    case __offer_type
        when 'tenancy' then insert into realtor.tenancy (monthly_price,
                                                         tenancy_id)
                            values (floor(random() * 1e3),
                                    __offer_id);
        when 'trade' then insert into realtor.trade (total_price,
                                                     trade_id)
                          values (floor(random() * 1e6),
                                  __offer_id);
        else raise 'unknown offer_type %', __offer_type;
        end case;
end;
$$ language plpgsql;

drop procedure if exists create_appointment;
create procedure create_appointment(
    in __offer_id bigint,
    inout __appointment_id bigint
) as
$$
declare
    __updated_at   timestamp with time zone := (select stat.updated_at
                                                from realtor.offer
                                                         join realtor.stat on offer.stat_id = stat.stat_id
                                                where offer_id = __offer_id);
    __scheduled_at timestamp with time zone := anon.random_in_tstzrange(tstzrange(__updated_at, now() + interval '1 month'));
begin
    insert into realtor.appointment (appointment_status,
                                     offer_id,
                                     scheduled_at)
    values (anon.random_in_enum(null::realtor.appointment_status),
            __offer_id,
            __scheduled_at)
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
                call create_document(__property_id, __document_id);

                begin
                    call create_user(__stat_id, __user_id);
                exception
                    when unique_violation then
                        continue;
                end;

                if not exists (select * from realtor.client) then
                    continue;
                end if;

                call create_offer(__property_id, __stat_id, __offer_id);
                call create_appointment(__offer_id, __appointment_id);
            end loop;
    end;
$$ language plpgsql;
