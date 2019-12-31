-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 31, 2019 at 04:20 AM
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
  `paid` tinyint(1) NOT NULL DEFAULT 0,
  `canceled` tinyint(1) NOT NULL DEFAULT 0,
  `points_1_cost` decimal(5,2) NOT NULL DEFAULT 0.00,
  `points_2_cost` decimal(5,2) NOT NULL DEFAULT 0.00,
  `points_3_cost` decimal(5,2) NOT NULL DEFAULT 0.00,
  `log` varchar(400) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `userID`, `locationID`, `resourceID`, `date`, `startTime`, `endTime`, `meetingType`, `title`, `description`, `noiseLevel`, `private`, `paid`, `canceled`, `points_1_cost`, `points_2_cost`, `points_3_cost`, `log`) VALUES
(331, 35, 1, '0', '2020-12-30', '13:00', '13:05', 0, '', '', 0, 0, 0, 0, '0.00', '0.00', '0.00', ''),
(332, 44, 1, '0', '2019-12-30', '15:00', '16:05', 0, '', '', 0, 0, 1, 0, '21.60', '0.00', '0.00', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=334;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
