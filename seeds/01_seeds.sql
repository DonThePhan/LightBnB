-- Empty table entries
DELETE FROM users;
DELETE FROM properties;
DELETE FROM reservations;
DELETE FROM property_reviews;

-- Reset PRIMARY KEYS to 1
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE properties_id_seq RESTART WITH 1;
ALTER SEQUENCE reservations_id_seq RESTART WITH 1;
ALTER SEQUENCE property_reviews_id_seq RESTART WITH 1;


INSERT INTO users (name, email, password)
VALUES
('Donny', 'donny@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Lana', 'lana@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Teddy', 'teddy@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

-- TODO WHY do the default values not set if I leave them blank?
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES 
(1, 'Kensington', 'description', 'https://www.fake_thumbnail.com/1.png', 'https://www.fake_photo.com/3.png', 25, 0, 2, 4, 'Canada', 'Nassau Street', 'Toronto', 'Ontario', 'M5T 1M6', true),
(2, 'Phan Clan', 'description', 'https://www.fake_thumbnail.com/2.png', 'https://www.fake_photo.com/3.png', 0, 6, 6, 4, 'Canada', 'Jasmine Street', 'Toronto', 'Ontario', 'M9M 2P8', true),
(3, 'Forest', 'description', 'https://www.fake_thumbnail.com/3.png', 'https://www.fake_photo.com/3.png', 0, 0, 0, 99, 'Canada', 'Nassau Street', 'Toronto', 'Ontario', '??? ???', false);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
('2022-01-01', '2022-01-05', 1,2),
('2021-12-14', '2022-01-01', 2,3),
('2020-01-01', '2020-01-02', 3,1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES 
(2,1,1, 4, 'small'),
(3,2,2, 5, 'great!'),
(1,3,3, 1, 'bring your own bed...');


SELECT * FROM users;
SELECT * FROM properties;
SELECT * FROM reservations;
SELECT * FROM property_reviews;