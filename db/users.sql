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
  `points_1` decimal(5,2) NOT NULL DEFAULT 0.00,
  `points_2` decimal(5,2) NOT NULL DEFAULT 0.00,
  `points_3` decimal(5,2) NOT NULL DEFAULT 0.00,
  `pointsLastUpdated` varchar(10) NOT NULL,
  `notes` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `picture`, `username`, `password`, `firstName`, `lastName`, `companyName`, `bio`, `email`, `phoneNumber`, `memberLevel`, `points_1`, `points_2`, `points_3`, `pointsLastUpdated`, `notes`) VALUES
(35, '', 'admin', 'admin', 'Ryan', 'Lackie', '', 'bio', 'admin@gmail.com', '484-343-2834', 6, '-0.80', '0.00', '198.60', '2019-12-30', 'note'),
(42, '', 'Caitlin', 'Mulligan', 'Caitlin', 'Mulligan', '', '', '', '', 5, '700.00', '500.00', '0.00', '2019-12-30', 'The Best'),
(44, '', 'user', 'user', '', '', '', '', '', '', 1, '38.40', '0.00', '0.00', '2019-12-30', ''),
(49, '', 'a', 'a', '', '', '', '', '', '', 2, '200.00', '0.00', '0.00', '2019-12-30', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
