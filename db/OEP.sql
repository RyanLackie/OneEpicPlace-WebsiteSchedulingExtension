-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 05, 2020 at 04:11 PM
-- Server version: 5.7.28-0ubuntu0.16.04.2
-- PHP Version: 7.0.33-0ubuntu0.16.04.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `OEP`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(10) NOT NULL,
  `userID` int(10) NOT NULL,
  `locationID` int(10) NOT NULL,
  `resourceID` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `startTime` varchar(100) NOT NULL,
  `endTime` varchar(100) NOT NULL,
  `meetingType` int(2) NOT NULL DEFAULT '0',
  `title` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(100) NOT NULL DEFAULT '',
  `noiseLevel` int(1) NOT NULL DEFAULT '0',
  `private` tinyint(1) NOT NULL DEFAULT '0',
  `paid` tinyint(1) NOT NULL DEFAULT '0',
  `canceled` tinyint(1) NOT NULL DEFAULT '0',
  `points_1_cost` decimal(5,2) NOT NULL DEFAULT '0.00',
  `points_2_cost` decimal(5,2) NOT NULL DEFAULT '0.00',
  `points_3_cost` decimal(5,2) NOT NULL DEFAULT '0.00',
  `log` varchar(400) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userID`, `locationID`, `resourceID`, `date`, `startTime`, `endTime`, `meetingType`, `title`, `description`, `noiseLevel`, `private`, `paid`, `canceled`, `points_1_cost`, `points_2_cost`, `points_3_cost`, `log`) VALUES
(333, 35, 1, '0', '2020-01-02', '11:00', '12:05', 0, '', '', 0, 0, 1, 0, '10.80', '0.00', '10.80', ''),
(334, 35, 1, '0', '2020-01-03', '12:00', '13:00', 0, 'lll', 'test', 0, 0, 1, 0, '10.00', '0.00', '10.00', '');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `lowerCost` decimal(4,2) NOT NULL DEFAULT '0.00',
  `higherCost` decimal(4,2) NOT NULL DEFAULT '0.00',
  `type` varchar(10) NOT NULL,
  `color` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `lowerCost`, `higherCost`, `type`, `color`) VALUES
(1, 'DaVinci Room', '10.00', '15.00', 'room', 'Aqua'),
(2, 'Green Room', '10.00', '15.00', 'room', 'Green'),
(3, 'Sunshine Room', '10.00', '15.00', 'room', 'Yellow'),
(4, 'Zen Room', '10.00', '15.00', 'room', 'Indigo'),
(5, 'Studio', '10.00', '15.00', 'room', 'Teal'),
(6, 'Carriage House Downstairs', '10.00', '15.00', 'room', 'MediumOrchid'),
(7, 'EPIC Room', '30.00', '40.00', 'room', 'Red'),
(9, 'Loft', '10.00', '15.00', 'room', 'LightPink'),
(10, 'Porch', '10.00', '15.00', 'room', 'DarkGoldenRod'),
(11, 'Lawn', '10.00', '15.00', 'room', 'DarkGreen'),
(12, 'Hot Desk 1', '2.50', '2.50', 'desk', 'Aqua'),
(13, 'Hot Desk 2', '2.50', '2.50', 'desk', 'Green'),
(14, 'Hot Desk 3', '2.50', '2.50', 'desk', 'Yellow'),
(15, 'Hot Desk 4', '2.50', '2.50', 'desk', 'Indigo'),
(16, 'Hot Desk 5', '2.50', '2.50', 'desk', 'Teal'),
(17, 'Hot Desk 6', '2.50', '2.50', 'desk', 'MediumOrchid'),
(18, 'Hot Desk 7', '2.50', '2.50', 'desk', 'Red'),
(19, 'Hot Desk 8', '2.50', '2.50', 'desk', 'Cyan'),
(20, 'Hot Desk 9', '2.50', '2.50', 'desk', 'LightPink'),
(21, 'Hot Desk 10', '2.50', '2.50', 'desk', 'DarkGoldenRod'),
(22, 'Hot Desk 11', '2.50', '2.50', 'desk', 'Aqua'),
(23, 'Hot Desk 12', '2.50', '2.50', 'desk', 'DarkGreen');

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `cost` int(4) NOT NULL,
  `quantity` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `name`, `cost`, `quantity`) VALUES
(1, 'White Board', 0, 2),
(2, 'Projector', 0, 2),
(3, 'HDMI Cable', 0, 5),
(5, '36" Flat Screen', 0, 1),
(6, 'Chairs (Specify in Description)', 0, 10),
(7, 'Room Setup (Specify in Description)', 0, 1),
(8, 'Cleaning Service', 0, 1),
(9, 'Room Breakdown', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `picture` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `companyName` varchar(20) NOT NULL,
  `bio` varchar(500) NOT NULL,
  `email` varchar(25) NOT NULL,
  `phoneNumber` varchar(15) NOT NULL,
  `memberLevel` int(2) NOT NULL,
  `points_1` decimal(5,2) NOT NULL DEFAULT '0.00',
  `points_2` decimal(5,2) NOT NULL DEFAULT '0.00',
  `points_3` decimal(5,2) NOT NULL DEFAULT '0.00',
  `pointsLastUpdated` varchar(100) NOT NULL,
  `notes` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `picture`, `username`, `password`, `firstName`, `lastName`, `companyName`, `bio`, `email`, `phoneNumber`, `memberLevel`, `points_1`, `points_2`, `points_3`, `pointsLastUpdated`, `notes`) VALUES
(35, '', 'admin', 'admin', 'Ryan', 'Lackie', '', 'bio', 'admin@gmail.com', '484-343-2834', 6, '-20.80', '0.00', '177.80', '2020-01-02 00:00:00.000', 'note'),
(44, '', 'user', 'user', 'user', 'user', '', '', 'user@gmail.com', '', 1, '100.00', '0.00', '0.00', '2020-01-02 00:00:00.000', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=335;
--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
