CREATE DATABASE obatin_db;

\c obatin_db

CREATE EXTENSION postgis;

--? start: validator

CREATE FUNCTION validate_operational_days(arr TEXT[]) RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        array_length(arr, 1) >= 1 AND 
        array_length(arr, 1) <= 7 AND
        NOT EXISTS (
            SELECT 1 FROM unnest(arr) AS days WHERE lower(days) NOT IN ('senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu')
        )
    );
END;
$$ LANGUAGE plpgsql;

--? end: validator

--? start: independent entities

CREATE TABLE banners(
    id BIGSERIAL PRIMARY KEY,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE reset_password_requests(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(64) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expired_at TIMESTAMP NOT NULL DEFAULT NOW() + '10 minutes',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

--? end: independent entities

--? start: strong entities

CREATE TABLE provinces(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TYPE user_role_enum AS ENUM ('admin', 'manager', 'doctor', 'user');
CREATE TABLE authentications(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(64) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    role user_role_enum NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE categories( 
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT,
    name VARCHAR(64) NOT NULL,
    category_slug VARCHAR(128) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    category_level SMALLINT NOT NULL,
    has_child_categories BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE doctor_specializations( 
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    slug VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TYPE shipping_type_enum AS ENUM ('official', 'non_official');
CREATE TABLE shipping_methods( 
    id BIGSERIAL PRIMARY KEY,
    price INTEGER,
    code VARCHAR(64),
    description VARCHAR(255),
    service VARCHAR(64),
    name VARCHAR(64) NOT NULL,
    estimated VARCHAR(64),
    type shipping_type_enum NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

CREATE TABLE manufacturers(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP
);

--? end: strong entities

--? start: relational entities

CREATE TYPE city_type_enum AS ENUM ('Kabupaten', 'Kota');
CREATE TABLE cities(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    type city_type_enum NOT NULL,
    postal_code VARCHAR(64) NOT NULL,
    province_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(province_id) REFERENCES provinces(id)
);

CREATE TABLE refresh_tokens(
    id BIGSERIAL PRIMARY KEY,
    authentication_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expired_at TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '1 day',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(authentication_id) REFERENCES authentications(id)
);

CREATE TYPE gender_enum AS ENUM ('perempuan', 'laki-laki');
CREATE TABLE users(
    id BIGSERIAL PRIMARY KEY,
    authentication_id BIGINT NOT NULL,
    name VARCHAR(64) NOT NULL DEFAULT '',
    gender gender_enum NOT NULL DEFAULT 'laki-laki',
    birth_date DATE NOT NULL DEFAULT '1970-01-01',
    active_address_id BIGINT,
    avatar_url VARCHAR(255) NOT NULL DEFAULT '',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(authentication_id) REFERENCES authentications(id)
);

CREATE DOMAIN operational_days_domain AS TEXT[] 
CONSTRAINT valid_operational_days CHECK (validate_operational_days(VALUE));
CREATE TABLE doctors(
    id BIGSERIAL PRIMARY KEY,
    authentication_id BIGINT NOT NULL,
    doctor_specialization_id BIGINT NOT NULL,
    name VARCHAR NOT NULL DEFAULT '',
    avatar_url VARCHAR(255) NOT NULL DEFAULT '',
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    experience_years SMALLINT NOT NULL DEFAULT 0,
    certificate_url VARCHAR(255) NOT NULL,
    fee BIGINT NOT NULL DEFAULT 0,
    opening_time TIME NOT NULL DEFAULT NOW(),
    operational_hours INTERVAL NOT NULL DEFAULT '0 hour',
    operational_days operational_days_domain NOT NULL DEFAULT ARRAY['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'],
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(authentication_id) REFERENCES authentications(id),
    FOREIGN KEY(doctor_specialization_id) REFERENCES doctor_specializations(id)
);

CREATE TABLE admins(
    id BIGSERIAL PRIMARY KEY,
    authentication_id BIGINT NOT NULL,
    name VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(authentication_id) REFERENCES authentications(id)
);

CREATE TABLE partners(
    id BIGSERIAL PRIMARY KEY,
    authentication_id BIGINT NOT NULL,
    name VARCHAR(64) NOT NULL,
    logo_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(authentication_id) REFERENCES authentications(id)
);

CREATE TYPE product_classification_enum AS ENUM ('obat_bebas', 'obat_bebas_terbatas', 'obat_keras', 'non_obat');
CREATE TABLE products(
    id BIGSERIAL PRIMARY KEY,
    manufacturer_id BIGINT NOT NULL,
    name VARCHAR UNIQUE NOT NULL,
    product_slug VARCHAR NOT NULL,
    general_indication VARCHAR NOT NULL,
    dosage VARCHAR NOT NULL,
    how_to_use VARCHAR NOT NULL,
    side_effects VARCHAR NOT NULL,
    contraindication VARCHAR NOT NULL,
    warning VARCHAR NOT NULL,
    bpom_number VARCHAR NOT NULL,
    generic_name VARCHAR NOT NULL,
    content VARCHAR NOT NULL,
    description VARCHAR NOT NULL,
    classification product_classification_enum NOT NULL,
    packaging VARCHAR NOT NULL,
    selling_unit VARCHAR NOT NULL,
    weight DECIMAL NOT NULL,
    height DECIMAL NOT NULL,
    length DECIMAL NOT NULL,
    width DECIMAL NOT NULL,
    image_url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_prescription_required BOOLEAN DEFAULT FALSE,
    min_price INTEGER NOT NULL DEFAULT 0,
    max_price INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(manufacturer_id) REFERENCES manufacturers(id)
);

CREATE TABLE products_categories(
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(category_id) REFERENCES categories(id)
);

CREATE TABLE pharmacies(
    id BIGSERIAL PRIMARY KEY,
    partner_id BIGINT NOT NULL,
    name VARCHAR(64) UNIQUE NOT NULL,
    address VARCHAR(255) UNIQUE NOT NULL,
    city_id BIGINT NOT NULL,
    lat DECIMAL NOT NULL,
    lng DECIMAL NOT NULL,
    opening_time TIME NOT NULL,
    operational_hours INTERVAL NOT NULL,
    operational_days TEXT[] NOT NULL CHECK (validate_operational_days(operational_days)),
    pharmacist_name VARCHAR(64) NOT NULL,
    pharmacist_license VARCHAR(64) NOT NULL,
    pharmacist_phone VARCHAR(32) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,    
    FOREIGN KEY(partner_id) REFERENCES partners(id),
    FOREIGN KEY(city_id) REFERENCES cities(id)
);

CREATE TABLE pharmacies_products(
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    pharmacy_id BIGINT NOT NULL,
    price INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(pharmacy_id) REFERENCES pharmacies(id)
);

CREATE TYPE stock_movement_enum AS ENUM ('manual_addition', 'internal_mutation', 'sale');
CREATE TABLE stock_movements(
    id BIGSERIAL PRIMARY KEY,
    pharmacy_product_id BIGINT NOT NULL,
    delta INTEGER NOT NULL,
    is_addition BOOLEAN NOT NULL,
    movement_type stock_movement_enum NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(pharmacy_product_id) REFERENCES pharmacies_products(id)
);

CREATE TABLE addresses(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    alias VARCHAR(64) NOT NULL,
    detail VARCHAR(255) NOT NULL,
    city_id BIGINT NOT NULL,
    lat DECIMAL NOT NULL,
    lng DECIMAL NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(city_id) REFERENCES cities(id)
);

CREATE TABLE shippings(
    id BIGSERIAL PRIMARY KEY,
    shipping_method_id BIGINT NOT NULL,
    pharmacy_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(shipping_method_id) REFERENCES shipping_methods(id),
    FOREIGN KEY(pharmacy_id) REFERENCES pharmacies(id)
);

CREATE TYPE payment_method_enum AS ENUM ('transfer', 'credit_card', 'e_wallet');
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    payment_method payment_method_enum NOT NULL DEFAULT 'transfer',
    total_payment INTEGER NOT NULL,
    payment_proof_url VARCHAR(255),
    is_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE payments
ADD COLUMN invoice_number TEXT;

CREATE FUNCTION gen_invoice_number() RETURNS TRIGGER AS $$
DECLARE
    curr_date TEXT;
    curr_id TEXT;
    new_invoice_number TEXT;
BEGIN
    curr_date := to_char(NEW.created_at, 'YYYYMMDD');
    SELECT MAX(id) INTO curr_id FROM payments WHERE date_trunc('day', created_at) = date_trunc('day', NEW.created_at);
    IF curr_id IS NULL THEN
        curr_id := '1';
    ELSE
        curr_id := to_char(to_number(curr_id, '999999') + 1, 'FM999999');
    END IF;
    new_invoice_number := 'INV/OBTN/' || curr_date || '/' || curr_id;
    NEW.invoice_number := new_invoice_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_gen_invoice_number
    BEFORE INSERT ON payments
    FOR EACH ROW
    EXECUTE FUNCTION gen_invoice_number();

CREATE TYPE delivery_status_enum AS ENUM ('waiting_payment', 'waiting_confirmation', 'processed', 'sent', 'confirmed', 'cancelled');
CREATE TABLE orders(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    shipping_id BIGINT NOT NULL,
    pharmacy_id BIGINT NOT NULL,
    status delivery_status_enum NOT NULL DEFAULT 'waiting_payment',
    number_items INTEGER NOT NULL,
    shipping_cost INTEGER NOT NULL,
    subtotal INTEGER NOT NULL,
    payment_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(shipping_id) REFERENCES shippings(id),
    FOREIGN KEY(pharmacy_id) REFERENCES pharmacies(id),
    FOREIGN KEY(payment_id) REFERENCES payments(id)
);

CREATE TABLE prescriptions(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    is_redeemed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(doctor_id) REFERENCES doctors(id)
);

CREATE TABLE cart_items(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_id BIGINT,
    pharmacy_id BIGINT,
    pharmacy_product_id BIGINT,
    product_id BIGINT,
    prescription_id BIGINT,
    quantity INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(pharmacy_product_id) REFERENCES pharmacies_products(id),
    FOREIGN KEY(prescription_id) REFERENCES prescriptions(id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(pharmacy_id) REFERENCES pharmacies(id)
);

CREATE TABLE prescription_items(
    id BIGSERIAL PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    amount INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(prescription_id) REFERENCES prescriptions(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
);

CREATE TABLE chat_rooms(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_user_typing BOOLEAN NOT NULL DEFAULT FALSE,
    is_doctor_typing BOOLEAN NOT NULL DEFAULT FALSE,
    expired_at TIMESTAMP NOT NULL DEFAULT NOW() + '30 minutes',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(doctor_id) REFERENCES doctors(id)
);

CREATE TYPE message_sender_enum AS ENUM ('user', 'doctor');
CREATE TABLE messages(
    id BIGSERIAL PRIMARY KEY,
    chat_room_id BIGINT NOT NULL,
    message VARCHAR(255) NOT NULL,
    sender message_sender_enum NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,
    FOREIGN KEY(chat_room_id) REFERENCES chat_rooms(id)
);

--? end: relational entities