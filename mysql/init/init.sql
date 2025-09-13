CREATE DATABASE IF NOT EXISTS mydb;

USE mydb;

CREATE TABLE IF NOT EXISTS users (
    users_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    School VARCHAR(100) NOT NULL DEFAULT 'No School Reported',
    email VARCHAR(320) NOT NULL UNIQUE,
    userDesc VARCHAR(500) DEFAULT 'Set Description',
    profilePic VARCHAR(100)


);

CREATE TABLE IF NOT EXISTS clubs (
    club_id INT AUTO_INCREMENT PRIMARY KEY,
    clubName VARCHAR(50) NOT NULL,
    clubDesc VARCHAR(500),
    School VARCHAR(30) NOT NULL DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leader VARCHAR(50),
    leaderName VARCHAR(30),
    flairPic VARCHAR(50),
    primaryFlair varChar(50) NOT NULL DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    camaraderie DOUBLE NOT NULL CHECK (camaraderie >= 0 AND camaraderie <= 100) DEFAULT 0,
    ascendancy DOUBLE NOT NULL CHECK (ascendancy >= 0 AND ascendancy <= 100) DEFAULT 0,
    prestige DOUBLE NOT NULL CHECK (prestige >= 0 AND prestige <= 100) DEFAULT 0,
    obligation DOUBLE NOT NULL CHECK (obligation >= 0 AND obligation <= 100) DEFAULT 0,
    legacy DOUBLE NOT NULL CHECK (legacy >= 0 AND legacy <= 100) DEFAULT 0,
    total DOUBLE NOT NULL CHECK (total >= 0 AND total <= 100) DEFAULT 0,
    instagram VARCHAR(50) NOT NULL DEFAULT '',
    linktree VARCHAR(50) NOT NULL DEFAULT ''

);


CREATE TABLE IF NOT EXISTS clubFlair (
    id INT AUTO_INCREMENT PRIMARY KEY,
    club_id INT NOT NULL,
    flairName VARCHAR(50) NOT NULL,
    UNIQUE(club_id, flairName),
    FOREIGN KEY (club_id) REFERENCES clubs(club_id)
);

CREATE TABLE IF NOT EXISTS clubMember (
    id INT AUTO_INCREMENT PRIMARY KEY,
    users_id INT,
    club_id INT,
    clubRole VARCHAR(50),
    FOREIGN KEY (users_id) REFERENCES users(users_id),
    FOREIGN KEY (club_id) REFERENCES clubs(club_id)
);

CREATE TABLE IF NOT EXISTS rating (
    id INT AUTO_INCREMENT PRIMARY KEY,
    users_id INT,
    club_id INT,
    camaraderie DOUBLE NOT NULL CHECK (camaraderie >= 0 AND camaraderie <= 100) DEFAULT 0,
    ascendancy DOUBLE NOT NULL CHECK (ascendancy >= 0 AND ascendancy <= 100) DEFAULT 0,
    prestige DOUBLE NOT NULL CHECK (prestige >= 0 AND prestige <= 100) DEFAULT 0,
    obligation DOUBLE NOT NULL CHECK (obligation >= 0 AND obligation <= 100) DEFAULT 0,
    legacy DOUBLE NOT NULL CHECK (legacy >= 0 AND legacy <= 100) DEFAULT 0,
    total DOUBLE NOT NULL CHECK (total >= 0 AND total <= 100) DEFAULT 0,
    review VARCHAR(500),
    FOREIGN KEY (users_id) REFERENCES users(users_id),
    FOREIGN KEY (club_id) REFERENCES clubs(club_id)
);
