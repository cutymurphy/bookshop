create table user_with_cart (
    id uuid default gen_random_uuid() primary key,
    is_admin boolean default false not null,
    name varchar(255) not null,
    surname varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    phone varchar(45) not null
);
create table author (
    id uuid default gen_random_uuid() primary key,
    name varchar(255) not null,
    surname varchar(255) not null,
    email varchar(255) default null,
    phone varchar(45) default null,
    admin_id uuid references user_with_cart(id) not null,
    date_modified timestamp not null
);
create table book (
    id uuid default gen_random_uuid() primary key,
    author_id uuid references author(id) default null,
    admin_id uuid references user_with_cart(id) not null,
    count smallint not null check(count >= 0) default 5,
    date_modified timestamp not null,
    name varchar(255) not null,
    price double precision not null check(price >= 0),
    category varchar(255) not null,
    genre varchar(255) not null,
    pages_count smallint check(pages_count >= 0) default null,
    weight smallint check(pages_count >= 0) default null,
    img_link varchar(255) not null,
    cover_type varchar(45) default null
);
create table user_book (
    user_id uuid references user_with_cart(id) not null,
    book_id uuid references book(id) not null,
    book_count int not null default 1,
    date timestamp not null,
    primary key (user_id, book_id)
);
create table _order (
    id uuid default gen_random_uuid() primary key ,
    number int not null unique,
    user_id uuid references user_with_cart(id) not null,
    date timestamp not null,
    address varchar(255) not null ,
    total_cost double precision not null,
    payment_method varchar(45) not null,
    status varchar(45) not null ,
    admin_id uuid references user_with_cart(id) default null,
    date_modified timestamp default null,
    message varchar(255) default null
);
create table cart_state (
    book_id uuid references book(id) primary key,
    book_count int default null,
    order_id uuid references _order(id) not null
);
#drop table user_with_cart, author, book, user_book, _order, cart_state