-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2025 at 05:57 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `movix`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `AdminEmail` varchar(50) NOT NULL,
  `AdminUser` varchar(50) NOT NULL,
  `Password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`AdminEmail`, `AdminUser`, `Password`) VALUES
('danai.ph@ku.th', 'Danai', 'danai062');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `CartID` int(3) NOT NULL,
  `Price` int(5) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `MovieID` varchar(10) DEFAULT NULL,
  `EmailMember` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`CartID`, `Price`, `Status`, `MovieID`, `EmailMember`) VALUES
(71, 59, 'Rental', 'MV003', 'eferymaster@gmail.com'),
(81, 1200, 'Rental', 'MV008', 'ssm066@hotmail.com'),
(85, 120, 'Rental', 'MV009', 'ssm066@hotmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(50) DEFAULT NULL,
  `EmailAdmin` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`CategoryID`, `CategoryName`, `EmailAdmin`) VALUES
(9, 'Actions', 'danai.ph@ku.th'),
(14, 'Adventure', 'danai.ph@ku.th'),
(16, 'Drama', 'danai.ph@ku.th'),
(17, 'Fantasy', 'danai.ph@ku.th'),
(18, 'Horror', 'danai.ph@ku.th'),
(19, 'war', 'danai.ph@ku.th');

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `ComentID` int(5) NOT NULL,
  `MemberEmail` varchar(50) NOT NULL,
  `MovieID` varchar(50) NOT NULL,
  `Coment` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comment`
--

INSERT INTO `comment` (`ComentID`, `MemberEmail`, `MovieID`, `Coment`) VALUES
(1, 'ssm066@hotmail.com', 'MV003', 'good'),
(2, 'ssm066@hotmail.com', 'MV003', 'good'),
(3, 'projecttest@er.com', 'MV008', 'หนังดี'),
(4, 'projecttest@er.com', 'MV008', 'สวย'),
(5, 'movix@movix.com', 'MV008', 'aaaa');

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

CREATE TABLE `member` (
  `MemberEmail` varchar(50) NOT NULL,
  `Username` varchar(50) DEFAULT NULL,
  `Password` varchar(50) DEFAULT NULL,
  `Reset_Password` varchar(50) DEFAULT NULL,
  `MemberCategory` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`MemberEmail`, `Username`, `Password`, `Reset_Password`, `MemberCategory`) VALUES
('deeja@j.com', 'deeja01', '12345', NULL, 'Rental'),
('eferymaster062@gmail.com', 'test', '1234', NULL, 'Rental'),
('eferymaster@gmail.com', 'danai', 'danai062', NULL, 'Subscription'),
('movix@movix.com', 'MovixTest', 'danai062', NULL, 'Subscription'),
('projecttest@er.com', 'project', '1234', NULL, 'Subscription'),
('ssm066@hotmail.com', 'ResetUser', '1234', '123010', 'Rental'),
('test02@test.com', 'test002', 'danai062', NULL, 'Rental'),
('test@test.com', 'test001', 'test', NULL, 'Rental'),
('testj@test.com', 'test', '12345', NULL, 'Subscription'),
('testpro@test.com', 'testpro', '11111', NULL, 'Rental');

-- --------------------------------------------------------

--
-- Table structure for table `movieseriescartoon`
--

CREATE TABLE `movieseriescartoon` (
  `MovieID` varchar(10) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Img_Poster` varchar(255) DEFAULT NULL,
  `Details` varchar(1000) NOT NULL,
  `Subtitle` varchar(10) DEFAULT NULL,
  `Voiceover` varchar(10) DEFAULT NULL,
  `Group` varchar(11) DEFAULT NULL,
  `Vdo_Trailer` varchar(255) DEFAULT NULL,
  `Price` int(5) DEFAULT NULL,
  `Viewer` int(10) DEFAULT NULL,
  `CategoryID` int(2) NOT NULL,
  `EmailAdmin` varchar(50) NOT NULL,
  `RentalDuration` int(7) DEFAULT NULL,
  `Episode` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movieseriescartoon`
--

INSERT INTO `movieseriescartoon` (`MovieID`, `Name`, `Img_Poster`, `Details`, `Subtitle`, `Voiceover`, `Group`, `Vdo_Trailer`, `Price`, `Viewer`, `CategoryID`, `EmailAdmin`, `RentalDuration`, `Episode`) VALUES
('MV003', 'Avengers Infinity War', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_etV2YX4kQl4Qx41gg8KoSKsO-do-OfyhwAl1f8f5-vRCME33co8c6tfY61FHtBYxA3U&usqp=CAU', 'เป็นเวลาเกือบทศวรรษแล้วที่ภาพยนตร์ของสตูดิโอที่ประสบความสำเร็จสูงที่สุดแห่งหนึ่งอย่าง Marvel ได้สร้างเรื่องราวของตัวละครซุปเปอร์ฮีโร่ให้กลายเป็นขวัญใจของคนทั่วทั้งโลก ซึ่งในปีหน้าภาพยนตร์ที่แฟนมาร์เวลทุกคนเฝ้ารอมาตั้งแต่เริ่มสร้างจักรวาลก็เตรียมตัวเข้าฉายให้เราชมแล้ว นั่นคือ Avengers: Infinity War ที่จะกลายเป็นสงครามครั้งใหญ่ระหว่างซุปเปอร์ฮีโร่และวายร้ายสุดโหดอย่าง Thanos', '-', 'TH', 'Movie', 'https://www.youtube.com/embed/cYuz5zQUjks?si=Lsbi61O9x01mAEwv', 120, 22, 9, 'danai.ph@ku.th', 7, 1),
('MV008', 'Journey 2: The Mysterious Island', 'https://m.media-amazon.com/images/I/91DqycL+bqL._UF1000,1000_QL80_.jpg', 'ในภาคต่อของหนังฮิต Journey to the Center of the Earth ฌอน เด็กหนุ่มวัย 17 ปี (จอช ฮัทเชอร์สัน กลับมาในบทเดิมจากภาคแรก) ได้รับสัญญาณขอความช่วยเหลือจากเกาะลึกลับที่เต็มไปด้วยสิ่งมีชีวิตสุดพิสดารและอันตราย ภูเขาไฟพร้อมปะทุ และความลับสุดอัศจรรย์! แต่เมื่อความตั้งใจของฌอนไม่อาจยับยั้งได้ พ่อเลี้ยงของเขา (ดเวย์น จอห์นสัน) จึงต้องเดินทางไปด้วย โดยมีนักขับเฮลิคอปเตอร์ (หลุยส์ กัซแมน) และลูกสาวหัวรั้น (วาเนสซ่า ฮัดเจนส์) มุ่งหน้าสู่เกาะมหัศจรรย์เพื่อช่วยเหลือมนุษย์คนเดียวที่อยู่ที่นั่น ก่อนที่แผ่นดินไหวจะฝังขุมสมบัติบนเกาะแห่งนั้นไปตลอดกาล', '-', 'TH', 'Movie', 'https://www.youtube.com/embed/aSTsUc4GO_g?si=HErzNDAq6LQvR2Z7', 120, 1, 14, 'danai.ph@ku.th', 15, 1),
('MV009', 'La La Land', 'https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_FMjpg_UX1000_.jpg', 'เส้นทางฝันช่างทอดยาวอย่างไม่เป็นใจให้เส้นทางรักหวานปนขมในลอสแอนเจลิสยุคปัจจุบัน เมื่อสองศิลปินเดินทางมาถึงทางแยกที่ร้าวรานใจ', '-', 'TH', 'Movie', 'https://www.youtube.com/embed/PZSBDxSAbjs?si=_CrFSjI-odB3QNWM', 120, 2, 16, 'danai.ph@ku.th', 15, 1),
('MV010', 'Dungeons & Dragons: Honor Among Thieves', 'https://m.media-amazon.com/images/M/MV5BOGRjMjQ0ZDAtODc0OS00MGY1LTkxMTMtODhhNjY5NTM4N2IwXkEyXkFqcGc@._V1_.jpg', 'A charming thief and a band of unlikely adventurers embark on an epic quest to retrieve a lost relic, but things go dangerously awry when they run afoul of the wrong people.', '-', 'TH', 'Movie', 'https://www.youtube.com/embed/kA34rSu6-Ew?si=2eJTDXX3NKgt0hxl', 120, 0, 17, 'danai.ph@ku.th', 15, 1),
('MV011', 'สกิลสุดพิสดารกับมื้ออาหารในต่างโลก', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr4zpEAA9bR_s-Euzc1Cbk9dJc7roAsfNcdg&s', 'ชายหนุ่มแสนธรรมดาจับพลัดจับผลูมาโผล่ในโลกต่างมิติ แต่โชคดีที่ได้รับพลังพิเศษที่ทำให้เขาสั่งของออนไลน์จากซูเปอร์มาเก็ตยุคใหม่ได้ และช่วยให้ผู้คนในโลกใหม่ได้สัมผัสความอร่อย.', 'TH', 'JP', 'Animation', 'https://www.youtube.com/embed/IVzyKAzKkqw?si=3-BbBAjuD4WiS-cq', 120, 2, 17, 'danai.ph@ku.th', 3, 2),
('MV012', 'Peacemaker ', 'https://resizing.flixster.com/YjquXjsEOPntiHVUvZlTljYnlZw=/ems.cHJkLWVtcy1hc3NldHMvdHZzZWFzb24vNDJkODE0MDctYjAzNy00MWIyLTlmMjgtZDM5YWY3MDI0YjUzLmpwZw==', 'เรื่องย่อ: เรื่องราวต่อจากหนังเมื่อ พีซเมเกอร์ วายรายผู้ยึดมั่นในสัตย์สาบานว่าจะยอมทำทุกอย่างเพื่อสันติภาพจนนำมาสู่จุดจบของตนเองใน ‘The Suicide Squad’ เขาได้รับการช่วยชีวิตจากกองทัพสหรัฐและถูกส่งมารับภารกิจใหม่โดยที่ตัวเขาก็ไม่เต็มใจนัก หน่วยพิเศษที่เล็กลงแต่มีสมาชิกที่เกรียนมากขึ้นต้องมาเจอภัยพิบัติระดับล้างโลกจะจบลงอย่างไรต้องติดตาม', '-', 'TH', 'Series', 'https://www.youtube.com/embed/_mrr3UNALww?si=SVUPtBkq9N60MmJc', 120, 0, 9, 'danai.ph@ku.th', 15, 8),
('MV013', 'ไซอิ๋ว 2013 คนเล็กอิทธิฤทธิ์หญ่าย', 'https://s.isanook.com/mv/0/ud/6/34494/poster.jpg', 'ภาพยนตร์เรื่อง \"ไซอิ๋ว 2013 คนเล็กอิทธิฤทธิ์หญ่าย\" (Journey to the West: Conquering the Demons) เล่าเรื่องราวของ \"ซวนจาง\" นักล่าปีศาจฝึกหัดที่ออกเดินทางเพื่อปราบปีศาจต่างๆ และได้พบกับ \"ซัวเจ๋ง\" \"ตือโป๊ยก่าย\" และ \"ซุนหงอคง\" ซึ่งเขาได้ชักชวนมาร่วมเดินทางด้วย และสอนให้รู้จักความรักและความเมตตา', '-', 'TH', 'Movie', 'https://www.youtube.com/embed/aelriSQLqkc?si=sSBwCkEk6J3RRbn7', 120, 2, 9, 'danai.ph@ku.th', 15, 1),
('MV014', 'อีวานเกเลียน: 1.0 กำเนิดใหม่วันพิพากษา', 'https://movie.thaiware.com/upload_misc/movie/2024_01/images-poster/240116120407477.jpg', 'ในปี 2015 สิบห้าปีหลังจากภัยพิบัติระดับโลกที่เรียกว่า Second Impact ชินจิ อิคาริวัย 14 ปีถูกเรียกตัวไปที่โตเกียว 3 โดยเก็นโด พ่อของเขาที่ห่างเหินกัน ซึ่งเป็นผู้บัญชาการขององค์กรทหาร Nerv ชินจิติดอยู่ท่ามกลางความขัดแย้งระหว่าง กองกำลัง สหประชาชาติกับสิ่งลึกลับที่ถูกเรียกว่าเทวดาแต่ได้รับการช่วยเหลือโดยกัปตันมิซาโตะ คัตสึรางิซึ่งนำเขาไปที่สำนักงานใหญ่ของเนิร์ฟ ที่นั่น เก็นโดะเรียกร้องให้ชินจิขับEvangelion Unit 01ซึ่งเป็นเครื่องจักรชีวภาพรูปร่างคล้ายมนุษย์ขนาดยักษ์ ต่อสู้กับเทวดา ชินจิยอมรับเมื่อเก็นโดมีเรย์ อายานามินักบินอีวานเกเลียนที่ได้รับบาดเจ็บ เตรียมถูกส่งออกไปแทน ชินจิหมดสติระหว่างการต่อสู้เนื่องจากได้รับบาดเจ็บจากนางฟ้าในหน่วย 01 ขณะที่หน่วย Evangelion สะท้อนถึงความเจ็บปวดจากการบาดเจ็บที่เกิดขึ้นกับนักบินอย่างเห็นอกเห็นใจ หน่วย 01 เปิดใช้งานอีกครั้งโดยอัตโนมัติและชนะการต่อสู้ โดยทำลายเทวทูต หลังการต่อสู้ มิซาโตะกลายเป็นผู้พิทักษ์ของชินจิ และเขาได้เข้าเรียนในโรงเรียนมัธยมต้นในท้องถิ่น เมื่อทูตสวรรค์อีกองค์หนึ่งมาถึงโทจิ ซูซูฮาระ เพื่อนร่วมชั้นของชินจิ และเคนสุเกะ ไอดะก็แอบออกจากที', '-', 'TH', 'Animation', 'https://www.youtube.com/embed/rof6qBz84vE?si=niEO90sPN2I3K3tN', 120, 3, 9, 'danai.ph@ku.th', 15, 1),
('MV015', 'The Conjuring', 'https://m.media-amazon.com/images/M/MV5BMTM3NjA1NDMyMV5BMl5BanBnXkFtZTcwMDQzNDMzOQ@@._V1_FMjpg_UX1000_.jpg', 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.', '-', '-', 'Movie', 'https://www.youtube.com/embed/bMgfsdYoEEo?si=C-DEf3ThNGZCm2VS', 120, 0, 18, 'danai.ph@ku.th', 15, 1);

-- --------------------------------------------------------

--
-- Table structure for table `payment_batch`
--

CREATE TABLE `payment_batch` (
  `PaymentBatchID` int(11) NOT NULL,
  `EmailMember` varchar(255) DEFAULT NULL,
  `PaymentMethod` varchar(50) DEFAULT NULL,
  `Img_slip` varchar(255) DEFAULT NULL,
  `Time_Slip` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `PaymentStatus` enum('pending','paid','failed') DEFAULT 'pending',
  `RentalIDs` text DEFAULT NULL,
  `AllPrice` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_batch`
--

INSERT INTO `payment_batch` (`PaymentBatchID`, `EmailMember`, `PaymentMethod`, `Img_slip`, `Time_Slip`, `PaymentStatus`, `RentalIDs`, `AllPrice`) VALUES
(2, 'test@test.com', 'offline', '1759688270_545843682_122222833544271401_8749014313626889914_n.jpg', '2025-10-06 13:46:37', 'paid', NULL, ''),
(3, 'test@test.com', 'offline', '1759688400_506046788_1646269246032888_7147486659195743795_n.jpg', '2025-10-06 13:46:29', 'paid', NULL, ''),
(4, 'test@test.com', 'offline', '1759688583_IMG_3686.JPG', '2025-10-06 13:45:12', 'paid', NULL, ''),
(5, 'test@test.com', 'offline', '1759688656_me.jpg', '2025-10-05 13:24:16', '', NULL, ''),
(6, 'test@test.com', 'offline', '1759688730_4apc5zrezz4.png', '2025-10-06 13:35:48', 'paid', NULL, ''),
(7, 'test@test.com', 'offline', '1759688876_506046788_1646269246032888_7147486659195743795_n.jpg', '2025-10-06 13:35:46', 'paid', NULL, ''),
(8, 'test@test.com', 'offline', '1759688955_dh0dLVLDLqUKhtytCFjkf3EHeJI-1200-1200-675-675-crop-000000.jpg', '2025-10-06 13:35:45', 'paid', NULL, ''),
(9, 'test@test.com', 'offline', '1759689017_dh0dLVLDLqUKhtytCFjkf3EHeJI-1200-1200-675-675-crop-000000.jpg', '2025-10-06 13:15:11', 'paid', '38', ''),
(10, 'test@test.com', 'offline', '1759689094_dh0dLVLDLqUKhtytCFjkf3EHeJI-1200-1200-675-675-crop-000000.jpg', '2025-10-06 13:17:58', 'paid', '39', ''),
(11, 'test@test.com', 'offline', '1759689212_dh0dLVLDLqUKhtytCFjkf3EHeJI-1200-1200-675-675-crop-000000.jpg', '2025-10-06 13:35:43', 'paid', '40', ''),
(12, 'test@test.com', 'offline', '1759689436_dh0dLVLDLqUKhtytCFjkf3EHeJI-1200-1200-675-675-crop-000000.jpg', '2025-10-06 13:35:41', 'paid', '2,3', ''),
(13, 'test@test.com', 'offline', '1759689707_dh0dLVLDLqUKhtytCFjkf3EHeJI-1200-1200-675-675-crop-000000.jpg', '2025-10-06 13:35:39', 'paid', '4', ''),
(14, 'test@test.com', 'offline', '1759689739_dh0dLVLDLqUKhtytCFjkf3EHeJI-1200-1200-675-675-crop-000000.jpg', '2025-10-06 13:35:38', 'paid', '5', ''),
(15, 'test@test.com', 'offline', '1759690985_IMG_3686.JPG', '2025-10-06 13:35:36', 'paid', '6,7', ''),
(16, 'test@test.com', 'offline', '1759692997_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 13:35:34', 'paid', '8,9,10', ''),
(17, 'test@test.com', 'offline', '1759693222_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-05 19:47:34', 'paid', '11,12,13', '118'),
(19, 'test@test.com', 'offline', '1759755736_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 14:18:04', 'paid', '15', '59'),
(20, 'test@test.com', 'offline', '1759762622_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 14:59:13', 'paid', '16', '59'),
(21, 'test@test.com', 'offline', '1759762670_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 09:57:50', 'pending', '17', '59'),
(22, 'test02@test.com', 'offline', '1759762785_VALORANT   9_17_2025 12_05_31 AM.png', '2025-10-06 15:06:02', 'paid', '18,19', '118'),
(23, 'test@test.com', 'offline', '1759769219_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 11:46:59', 'pending', '20', '0'),
(24, 'test@test.com', 'offline', '1759770879_VALORANT   9_17_2025 12_05_31 AM.png', '2025-10-06 12:14:39', 'pending', '21,22', '0'),
(25, 'testj@test.com', 'offline', '1759771018_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 23:20:16', 'failed', '23', '0'),
(26, 'testj@test.com', 'offline', '1759774122_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 23:20:14', 'failed', '24,25,26,27', '59'),
(27, 'test@test.com', 'offline', '1759785468_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 23:20:12', 'failed', '28', '123123'),
(28, 'testpro@test.com', 'offline', '1759788815_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 22:50:40', 'failed', '29,30', '118'),
(29, 'testpro@test.com', 'offline', '1759792886_VALORANT   9_17_2025 8_01_57 PM.png', '2025-10-06 23:26:48', 'paid', '31,32,33', '177'),
(30, 'ssm066@hotmail.com', 'offline', '1759848636_movix-bg.jpg', '2025-10-07 14:51:04', 'paid', '34', '59'),
(31, 'movix@movix.com', 'QRCode', '1759859458_slip.jpg', '2025-10-07 18:12:21', 'paid', '35,36', '659'),
(32, 'projecttest@er.com', 'QRCode', '1760581193_slip.jpg', '2025-10-16 02:25:09', 'paid', '37,38', '240');

-- --------------------------------------------------------

--
-- Table structure for table `ratingreview`
--

CREATE TABLE `ratingreview` (
  `ReviewID` int(11) NOT NULL,
  `Rating` float(3,1) DEFAULT NULL,
  `MemberEmail` varchar(50) DEFAULT NULL,
  `MovieID` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ratingreview`
--

INSERT INTO `ratingreview` (`ReviewID`, `Rating`, `MemberEmail`, `MovieID`) VALUES
(1, 5.0, 'deeja@j.com', 'MV003'),
(2, 2.0, 'test02@test.com', 'MV003'),
(3, 3.0, 'test@test.com', 'MV003'),
(4, 3.0, 'test@test.com', 'MV008'),
(5, 4.0, 'test@test.com', 'MV010'),
(6, 3.0, 'testpro@test.com', 'MV008'),
(7, 4.0, 'testpro@test.com', 'MV003'),
(8, 3.0, 'testpro@test.com', 'MV010'),
(9, 4.0, 'ssm066@hotmail.com', 'MV003'),
(10, 4.0, 'movix@movix.com', 'MV003'),
(11, 3.0, 'projecttest@er.com', 'MV003');

-- --------------------------------------------------------

--
-- Table structure for table `rental`
--

CREATE TABLE `rental` (
  `RentalID` int(11) NOT NULL,
  `Status` varchar(25) DEFAULT NULL,
  `Price` int(11) DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `EndDate` datetime DEFAULT NULL,
  `EmailAdmin` varchar(50) DEFAULT NULL,
  `MemberEmail` varchar(50) DEFAULT NULL,
  `MovieID` varchar(50) DEFAULT NULL,
  `DateTimeStamp` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rental`
--

INSERT INTO `rental` (`RentalID`, `Status`, `Price`, `StartDate`, `EndDate`, `EmailAdmin`, `MemberEmail`, `MovieID`, `DateTimeStamp`) VALUES
(1, 'pending', 59, '2025-10-05 20:33:32', '2025-10-08 20:33:32', 'admin@movix.com', 'test@test.com', '40', '2025-10-05 20:33:32'),
(20, 'pending', 0, '2025-10-06 18:46:59', '2025-10-09 18:46:59', NULL, 'test@test.com', 'MV015', '2025-10-06 18:46:59'),
(21, 'pending', 0, '2025-10-06 19:14:39', '2025-10-09 19:14:39', 'null', 'test@test.com', 'MV005', '2025-10-06 19:14:39'),
(22, 'pending', 0, '2025-10-06 19:14:39', '2025-10-06 19:14:39', 'null', 'test@test.com', 'MV014', '2025-10-06 19:14:39'),
(37, 'expired', 120, '2025-10-16 04:19:53', '2025-10-16 04:19:53', 'danai.ph@ku.th', 'projecttest@er.com', 'MV003', '2025-10-16 04:19:53'),
(38, 'active', 120, '2025-10-16 04:19:53', '2025-10-31 04:19:53', 'danai.ph@ku.th', 'projecttest@er.com', 'MV008', '2025-10-16 04:19:53');

-- --------------------------------------------------------

--
-- Table structure for table `subscription`
--

CREATE TABLE `subscription` (
  `SubscriptionID` int(11) NOT NULL,
  `Status` varchar(25) DEFAULT NULL,
  `Price` int(5) DEFAULT NULL,
  `StartDate` datetime DEFAULT NULL,
  `EndDate` datetime DEFAULT NULL,
  `EmailAdmin` varchar(50) DEFAULT NULL,
  `EmailMember` varchar(50) NOT NULL,
  `SubscriptionPaymentID` int(3) NOT NULL,
  `DateTimeStamp` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscription`
--

INSERT INTO `subscription` (`SubscriptionID`, `Status`, `Price`, `StartDate`, `EndDate`, `EmailAdmin`, `EmailMember`, `SubscriptionPaymentID`, `DateTimeStamp`) VALUES
(4, 'failed', 99, '2025-10-06 14:21:02', '2025-11-05 14:21:02', 'danai.ph@ku.th', 'test@test.com', 4, '2025-10-06 19:21:02'),
(5, 'failed', 99, '2025-10-06 14:22:53', '2025-11-05 14:22:53', 'danai.ph@ku.th', 'test@test.com', 5, '2025-10-06 19:22:53'),
(6, 'failed', 99, '2025-10-06 14:37:47', '2025-11-05 14:37:47', 'danai.ph@ku.th', 'test@test.com', 6, '2025-10-06 19:37:47'),
(7, 'failed', 99, '2025-10-06 14:42:11', '2025-11-05 14:42:11', 'danai.ph@ku.th', 'test@test.com', 7, '2025-10-06 19:42:11'),
(8, 'failed', 99, '2025-10-06 14:44:14', '2025-11-05 14:44:14', 'danai.ph@ku.th', 'test@test.com', 8, '2025-10-06 19:44:14'),
(9, 'failed', 99, '2025-10-06 14:46:43', '2025-11-05 14:46:43', 'danai.ph@ku.th', 'test@test.com', 9, '2025-10-06 19:46:43'),
(10, 'failed', 99, '2025-10-06 14:53:25', '2025-11-05 14:53:25', 'danai.ph@ku.th', 'test@test.com', 10, '2025-10-06 19:53:25'),
(11, 'expired', 99, '2025-10-06 14:53:36', '2025-10-06 14:53:36', 'danai.ph@ku.th', 'test@test.com', 11, '2025-10-06 19:53:36'),
(12, 'expired', 99, '2025-10-06 14:58:19', '2025-10-06 14:58:19', 'danai.ph@ku.th', 'test@test.com', 12, '2025-10-06 19:58:19'),
(13, 'approved', 99, '2025-10-06 19:51:41', '2025-11-05 19:51:41', 'danai.ph@ku.th', 'testj@test.com', 13, '2025-10-07 00:51:41'),
(14, 'approved', 99, '2025-10-06 23:57:50', '2025-11-05 23:57:50', 'danai.ph@ku.th', 'test@test.com', 14, '2025-10-07 04:57:50'),
(15, 'pending', 99, '2025-10-07 00:04:32', '2025-11-06 00:04:32', NULL, 'testpro@test.com', 15, '2025-10-07 05:04:32'),
(16, 'pending', 99, '2025-10-07 00:06:01', '2025-11-06 00:06:01', NULL, 'testpro@test.com', 16, '2025-10-07 05:06:01'),
(17, 'approved', 99, '2025-10-07 20:58:18', '2025-11-06 20:58:18', 'danai.ph@ku.th', 'movix@movix.com', 17, '2025-10-08 01:58:18'),
(18, 'approved', 99, '2025-10-16 04:35:53', '2025-11-15 04:35:53', 'danai.ph@ku.th', 'projecttest@er.com', 18, '2025-10-16 09:35:53');

-- --------------------------------------------------------

--
-- Table structure for table `subscriptionpayment`
--

CREATE TABLE `subscriptionpayment` (
  `SubscriptionPaymentID` int(11) NOT NULL,
  `Time_Slip` datetime DEFAULT NULL,
  `Img_slip` varchar(50) DEFAULT NULL,
  `PaymentStatus` varchar(25) DEFAULT NULL,
  `PaymentMethod` varchar(50) DEFAULT NULL,
  `SubscriptionID` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscriptionpayment`
--

INSERT INTO `subscriptionpayment` (`SubscriptionPaymentID`, `Time_Slip`, `Img_slip`, `PaymentStatus`, `PaymentMethod`, `SubscriptionID`) VALUES
(4, '2025-10-06 19:21:02', '1759753262_VALORANT   9_17_2025 12_05_31 AM.png', 'failed', 'offline', 4),
(5, '2025-10-06 19:22:53', '1759753373_VALORANT   9_20_2025 5_51_55 PM.png', 'failed', 'offline', 5),
(6, '2025-10-06 19:37:47', '1759754267_VALORANT   9_20_2025 5_51_55 PM.png', 'failed', 'offline', 6),
(7, '2025-10-06 19:42:11', '1759754531_VALORANT   9_17_2025 8_01_57 PM.png', 'failed', 'offline', 7),
(8, '2025-10-06 19:44:14', '1759754654_VALORANT   9_20_2025 5_51_55 PM.png', 'failed', 'offline', 8),
(9, '2025-10-06 19:46:43', '1759754803_VALORANT   9_17_2025 8_01_57 PM.png', 'failed', 'offline', 9),
(10, '2025-10-06 19:53:25', '1759755205_VALORANT   9_17_2025 8_01_57 PM.png', 'failed', 'offline', 10),
(11, '2025-10-06 19:53:36', '1759755216_VALORANT   9_17_2025 8_01_57 PM.png', 'approved', 'offline', 11),
(12, '2025-10-06 19:58:19', 'slip_68e3bcebae6ea0.27500634.png', 'approved', 'offline', 12),
(13, '2025-10-07 00:51:41', 'slip_68e401ad857e71.19162099.png', 'approved', 'offline', 13),
(14, '2025-10-07 04:57:50', 'slip_68e43b5e628014.42161745.png', 'approved', 'offline', 14),
(15, '2025-10-07 05:04:32', 'slip_68e43cf0b9ead6.21900643.png', 'pending', 'offline', 15),
(16, '2025-10-07 05:06:01', 'slip_68e43d493f0fa2.52548905.png', 'pending', 'offline', 16),
(17, '2025-10-08 01:58:18', 'slip_68e562ca9678a4.99506149.jpg', 'approved', 'QRCode', 17),
(18, '2025-10-16 09:35:53', 'slip_68f05a099b3750.33208702.jpg', 'approved', 'QRCode', 18);

-- --------------------------------------------------------

--
-- Table structure for table `vdomsc`
--

CREATE TABLE `vdomsc` (
  `VdoMSC_ID` varchar(500) NOT NULL,
  `MovieID` varchar(10) DEFAULT NULL,
  `Episode` int(4) NOT NULL,
  `FilePath` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vdomsc`
--

INSERT INTO `vdomsc` (`VdoMSC_ID`, `MovieID`, `Episode`, `FilePath`) VALUES
('msc_68e2c185d071a', 'MV014', 1, 'videos/ep_68e2c185d0549.mp4'),
('msc_68e67be6e3605', 'MV013', 1, 'videos/ep_68e67be6e3369.mp4'),
('msc_68efa55cad0a3', 'MV003', 1, 'videos/ep_68efa55cace09.mp4'),
('msc_68f0385f173ea', 'MV008', 1, 'videos/ep_68f0385f170f4.mp4'),
('msc_68f038a96dabf', 'MV009', 1, 'videos/ep_68f038a96d76b.mp4'),
('msc_68f03933be741', 'MV010', 1, 'videos/ep_68f03933be2f0.mp4'),
('msc_68f039632118e', 'MV015', 1, 'videos/ep_68f0396320f34.mp4'),
('msc_68f03b7251cca', 'MV011', 1, 'videos/ep_68f03b7251a70.mp4'),
('msc_68f03b7b20351', 'MV011', 2, 'videos/ep_68f03b7b20153.mp4'),
('msc_68f05b785bc5d', 'MV011', 3, 'videos/ep_68f05b785ba2f.mp4');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`AdminEmail`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`CartID`),
  ADD KEY `MovieID` (`MovieID`),
  ADD KEY `EmailMember` (`EmailMember`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`CategoryID`),
  ADD KEY `EmailAdmin` (`EmailAdmin`);

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`ComentID`);

--
-- Indexes for table `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`MemberEmail`);

--
-- Indexes for table `movieseriescartoon`
--
ALTER TABLE `movieseriescartoon`
  ADD PRIMARY KEY (`MovieID`),
  ADD KEY `CategoryID` (`CategoryID`),
  ADD KEY `EmailAdmin` (`EmailAdmin`);

--
-- Indexes for table `payment_batch`
--
ALTER TABLE `payment_batch`
  ADD PRIMARY KEY (`PaymentBatchID`);

--
-- Indexes for table `ratingreview`
--
ALTER TABLE `ratingreview`
  ADD PRIMARY KEY (`ReviewID`),
  ADD KEY `MemberEmail` (`MemberEmail`),
  ADD KEY `MovieID` (`MovieID`);

--
-- Indexes for table `rental`
--
ALTER TABLE `rental`
  ADD PRIMARY KEY (`RentalID`);

--
-- Indexes for table `subscription`
--
ALTER TABLE `subscription`
  ADD PRIMARY KEY (`SubscriptionID`,`EmailMember`,`SubscriptionPaymentID`),
  ADD KEY `EmailAdmin` (`EmailAdmin`),
  ADD KEY `EmailMember` (`EmailMember`),
  ADD KEY `SubscriptionPaymentID` (`SubscriptionPaymentID`);

--
-- Indexes for table `subscriptionpayment`
--
ALTER TABLE `subscriptionpayment`
  ADD PRIMARY KEY (`SubscriptionPaymentID`),
  ADD KEY `SubscriptionID` (`SubscriptionID`);

--
-- Indexes for table `vdomsc`
--
ALTER TABLE `vdomsc`
  ADD PRIMARY KEY (`VdoMSC_ID`),
  ADD KEY `MovieID` (`MovieID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `CartID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `ComentID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payment_batch`
--
ALTER TABLE `payment_batch`
  MODIFY `PaymentBatchID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `ratingreview`
--
ALTER TABLE `ratingreview`
  MODIFY `ReviewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2147483648;

--
-- AUTO_INCREMENT for table `rental`
--
ALTER TABLE `rental`
  MODIFY `RentalID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `subscription`
--
ALTER TABLE `subscription`
  MODIFY `SubscriptionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `subscriptionpayment`
--
ALTER TABLE `subscriptionpayment`
  MODIFY `SubscriptionPaymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`MovieID`) REFERENCES `movieseriescartoon` (`MovieID`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`EmailMember`) REFERENCES `member` (`MemberEmail`);

--
-- Constraints for table `category`
--
ALTER TABLE `category`
  ADD CONSTRAINT `category_ibfk_1` FOREIGN KEY (`EmailAdmin`) REFERENCES `admin` (`AdminEmail`);

--
-- Constraints for table `movieseriescartoon`
--
ALTER TABLE `movieseriescartoon`
  ADD CONSTRAINT `movieseriescartoon_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `category` (`CategoryID`),
  ADD CONSTRAINT `movieseriescartoon_ibfk_2` FOREIGN KEY (`EmailAdmin`) REFERENCES `admin` (`AdminEmail`);

--
-- Constraints for table `ratingreview`
--
ALTER TABLE `ratingreview`
  ADD CONSTRAINT `ratingreview_ibfk_1` FOREIGN KEY (`MemberEmail`) REFERENCES `member` (`MemberEmail`),
  ADD CONSTRAINT `ratingreview_ibfk_2` FOREIGN KEY (`MovieID`) REFERENCES `movieseriescartoon` (`MovieID`);

--
-- Constraints for table `subscription`
--
ALTER TABLE `subscription`
  ADD CONSTRAINT `subscription_ibfk_1` FOREIGN KEY (`EmailAdmin`) REFERENCES `admin` (`AdminEmail`),
  ADD CONSTRAINT `subscription_ibfk_2` FOREIGN KEY (`EmailMember`) REFERENCES `member` (`MemberEmail`),
  ADD CONSTRAINT `subscription_ibfk_3` FOREIGN KEY (`SubscriptionPaymentID`) REFERENCES `subscriptionpayment` (`SubscriptionPaymentID`);

--
-- Constraints for table `subscriptionpayment`
--
ALTER TABLE `subscriptionpayment`
  ADD CONSTRAINT `subscriptionpayment_ibfk_1` FOREIGN KEY (`SubscriptionID`) REFERENCES `subscription` (`SubscriptionID`);

--
-- Constraints for table `vdomsc`
--
ALTER TABLE `vdomsc`
  ADD CONSTRAINT `vdomsc_ibfk_1` FOREIGN KEY (`MovieID`) REFERENCES `movieseriescartoon` (`MovieID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
