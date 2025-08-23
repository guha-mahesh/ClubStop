USE mydb;

CREATE TABLE club_flairs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    flair_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO club_flairs (flair_name) VALUES

('Computer Science'),
('Engineering'),
('Mathematics'),
('Physics'),
('Chemistry'),
('Biology'),
('Psychology'),
('Economics'),
('Business'),
('Philosophy'),
('History'),
('Political Science'),
('Sociology'),
('Anthropology'),
('Literature'),
('Languages'),
('Education'),
('Medicine'),
('Law'),
('Architecture'),
('Environmental Science'),
('Neuroscience'),
('Data Science'),
('Statistics'),
('Communications'),


('Academic'),
('Professional'),
('Cultural'),
('Arts'),
('Music'),
('Theatre'),
('Dance'),
('Sports'),
('Recreation'),
('Social'),
('Community Service'),
('Leadership'),
('Technology'),
('Research'),
('Entrepreneurship'),
('Health & Wellness'),
('Sustainability'),
('International'),
('Religious'),
('Media'),
('Gaming'),
('Outdoors'),
('Hobby'),
('Networking'),
('Competition');