-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 31, 2019 at 11:01 PM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

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
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `lowerCost` decimal(4,2) NOT NULL DEFAULT 0.00,
  `higherCost` decimal(4,2) NOT NULL DEFAULT 0.00,
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

--
-- Indexes for dumped tables
--

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
