-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 26, 2019 at 08:19 PM
-- Server version: 10.3.16-MariaDB
-- PHP Version: 7.3.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `oep_dev`
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
  `meetingType` int(2) NOT NULL DEFAULT 0,
  `title` varchar(100) NOT NULL DEFAULT '',
  `description` varchar(100) NOT NULL DEFAULT '',
  `noiseLevel` int(1) NOT NULL DEFAULT 0,
  `private` tinyint(1) NOT NULL DEFAULT 0,
  `canceled` tinyint(1) NOT NULL DEFAULT 0,
  `log` varchar(400) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userID`, `locationID`, `resourceID`, `date`, `startTime`, `endTime`, `meetingType`, `title`, `description`, `noiseLevel`, `private`, `canceled`, `log`) VALUES
(260, 35, 1, '0', '2019-07-16', '11:00', '12:00', 0, '', '', 1, 1, 0, ''),
(285, 35, 1, '0', '2019-07-17', '12:00', '13:00', 0, '', '', 0, 1, 0, ''),
(286, 35, 2, '0', '2019-07-16', '12:00', '13:00', 0, '3', '', 0, 0, 0, ''),
(287, 35, 2, '0', '2019-07-16', '13:00', '14:00', 0, '33', '', 0, 0, 0, ''),
(288, 35, 2, '0', '2019-07-16', '14:00', '15:00', 0, '333', '', 0, 0, 0, ''),
(289, 35, 2, '0', '2019-07-16', '16:00', '17:00', 0, 'ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt', '', 1, 1, 0, ''),
(292, 35, 1, '0', '2019-07-16', '13:00', '14:00', 0, 'test', '', 0, 1, 0, ''),
(294, 41, 2, '0', '2019-07-16', '11:00', '12:00', 0, 'test', '', 1, 0, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `cost` int(4) NOT NULL,
  `type` varchar(10) NOT NULL,
  `color` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `name`, `cost`, `type`, `color`) VALUES
(1, 'DaVinci Room', 10, 'room', 'Aqua'),
(2, 'Green Room', 7, 'room', 'green'),
(3, 'Sunshine Room', 7, 'room', 'yellow'),
(4, 'Zen Room', 6, 'room', 'indigo'),
(5, 'Studio', 13, 'room', 'teal'),
(6, 'EPIC Room', 17, 'room', 'mediumorchid'),
(7, 'Carriage House Treatment Room', 15, 'room', 'red'),
(8, 'Business Hub', 10, 'room', 'cyan'),
(9, 'Loft', 10, 'room', 'lightpink'),
(10, 'Porch', 5, 'room', 'darkgoldenrod'),
(11, 'Lawn', 5, 'room', 'darkgreen'),
(12, 'Hot Desk 1', 5, 'desk', 'blue'),
(13, 'Hot Desk 2', 5, 'desk', 'green'),
(14, 'Hot Desk 3', 5, 'desk', 'yellow'),
(15, 'Hot Desk 4', 5, 'desk', 'indigo'),
(16, 'Hot Desk 5', 5, 'desk', 'teal'),
(17, 'Hot Desk 6', 5, 'desk', 'mediumorchid'),
(18, 'Hot Desk 7', 5, 'desk', 'red'),
(19, 'Hot Desk 8', 5, 'desk', 'cyan'),
(20, 'Hot Desk 9', 5, 'desk', 'lightpink'),
(21, 'Hot Desk 10', 5, 'desk', 'darkgoldenrod'),
(22, 'Hot Desk 11', 5, 'desk', 'blue'),
(23, 'Hot Desk 12', 5, 'desk', 'green');

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
(4, 'Coaching with Julie & Nicole', 0, 1),
(5, '36\" Flat Screen', 0, 1),
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
  `points` int(5) NOT NULL,
  `notes` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `picture`, `username`, `password`, `firstName`, `lastName`, `companyName`, `bio`, `email`, `phoneNumber`, `memberLevel`, `points`, `notes`) VALUES
(35, '', 'admin', 'admin', 'Ryan', 'Lackie', '', 'bio', 'admin@gmail.com', '484-343-2834', 6, 1, 'note'),
(41, '', 'user', 'user', '', '', '', '', '', '', 1, 0, ''),
(42, '', 'Caitlin', 'Mulligan', 'Caitlin', 'Mulligan', '', '', '', '', 5, 500, 'The Best');

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
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=298;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
