-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (arm64)
--
-- Host: 127.0.0.1    Database: soulfood
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `BATCH`
--

DROP TABLE IF EXISTS `BATCH`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BATCH` (
  `BatchID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int NOT NULL,
  `FarmID` int NOT NULL,
  `HarvestDate` date DEFAULT NULL,
  `ProcessingDate` date DEFAULT NULL,
  `Quantity` int NOT NULL,
  `Temprature` decimal(5,2) DEFAULT NULL,
  `Humidity` decimal(5,2) DEFAULT NULL,
  `PreservationRate` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`BatchID`),
  KEY `ProductID` (`ProductID`),
  KEY `FarmID` (`FarmID`),
  CONSTRAINT `batch_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `PRODUCT` (`ProductID`),
  CONSTRAINT `batch_ibfk_2` FOREIGN KEY (`FarmID`) REFERENCES `FARM` (`FarmID`)
) ENGINE=InnoDB AUTO_INCREMENT=40001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BATCH`
--

LOCK TABLES `BATCH` WRITE;
/*!40000 ALTER TABLE `BATCH` DISABLE KEYS */;
/*!40000 ALTER TABLE `BATCH` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `BATCH_WAREHOUSE`
--

DROP TABLE IF EXISTS `BATCH_WAREHOUSE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `BATCH_WAREHOUSE` (
  `BatchID` int NOT NULL,
  `WarehouseID` int NOT NULL,
  `EntryDate` date NOT NULL,
  `ExitDate` date DEFAULT NULL,
  `Quantity` int NOT NULL,
  KEY `BatchID` (`BatchID`),
  KEY `WarehouseID` (`WarehouseID`),
  CONSTRAINT `batch_warehouse_ibfk_1` FOREIGN KEY (`BatchID`) REFERENCES `BATCH` (`BatchID`),
  CONSTRAINT `batch_warehouse_ibfk_2` FOREIGN KEY (`WarehouseID`) REFERENCES `WAREHOUSE` (`WarehouseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `BATCH_WAREHOUSE`
--

LOCK TABLES `BATCH_WAREHOUSE` WRITE;
/*!40000 ALTER TABLE `BATCH_WAREHOUSE` DISABLE KEYS */;
/*!40000 ALTER TABLE `BATCH_WAREHOUSE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `FARM`
--

DROP TABLE IF EXISTS `FARM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `FARM` (
  `FarmID` int NOT NULL AUTO_INCREMENT,
  `PostalCode` varchar(20) DEFAULT NULL,
  `FarmName` varchar(100) NOT NULL,
  `Location` varchar(100) NOT NULL,
  PRIMARY KEY (`FarmID`)
) ENGINE=InnoDB AUTO_INCREMENT=10001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `FARM`
--

LOCK TABLES `FARM` WRITE;
/*!40000 ALTER TABLE `FARM` DISABLE KEYS */;
/*!40000 ALTER TABLE `FARM` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `GRADING`
--

DROP TABLE IF EXISTS `GRADING`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `GRADING` (
  `ListingID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int NOT NULL,
  `FarmID` int NOT NULL,
  `LotCount` int NOT NULL,
  PRIMARY KEY (`ListingID`),
  KEY `ProductID` (`ProductID`),
  KEY `FarmID` (`FarmID`),
  CONSTRAINT `grading_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `PRODUCT` (`ProductID`),
  CONSTRAINT `grading_ibfk_2` FOREIGN KEY (`FarmID`) REFERENCES `FARM` (`FarmID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `GRADING`
--

LOCK TABLES `GRADING` WRITE;
/*!40000 ALTER TABLE `GRADING` DISABLE KEYS */;
/*!40000 ALTER TABLE `GRADING` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `INSPECTOR`
--

DROP TABLE IF EXISTS `INSPECTOR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `INSPECTOR` (
  `InspectorID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Total_Inspections` int DEFAULT '0',
  PRIMARY KEY (`InspectorID`)
) ENGINE=InnoDB AUTO_INCREMENT=2501 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `INSPECTOR`
--

LOCK TABLES `INSPECTOR` WRITE;
/*!40000 ALTER TABLE `INSPECTOR` DISABLE KEYS */;
/*!40000 ALTER TABLE `INSPECTOR` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PRODUCT`
--

DROP TABLE IF EXISTS `PRODUCT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PRODUCT` (
  `ProductID` int NOT NULL AUTO_INCREMENT,
  `FarmID` int NOT NULL,
  `ProdName` varchar(100) NOT NULL,
  `Origin` varchar(100) DEFAULT NULL,
  `HarvestDate` date DEFAULT NULL,
  PRIMARY KEY (`ProductID`),
  KEY `FarmID` (`FarmID`),
  CONSTRAINT `product_ibfk_1` FOREIGN KEY (`FarmID`) REFERENCES `FARM` (`FarmID`)
) ENGINE=InnoDB AUTO_INCREMENT=20001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PRODUCT`
--

LOCK TABLES `PRODUCT` WRITE;
/*!40000 ALTER TABLE `PRODUCT` DISABLE KEYS */;
/*!40000 ALTER TABLE `PRODUCT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `QUALITY_CONTROL_RECORD`
--

DROP TABLE IF EXISTS `QUALITY_CONTROL_RECORD`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `QUALITY_CONTROL_RECORD` (
  `RecordID` int NOT NULL AUTO_INCREMENT,
  `BatchID` int NOT NULL,
  `InspectorName` varchar(100) NOT NULL,
  `InspectionDate` date NOT NULL,
  `InspectorID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  `Temperature` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`RecordID`),
  KEY `BatchID` (`BatchID`),
  KEY `InspectorID` (`InspectorID`),
  CONSTRAINT `quality_control_record_ibfk_1` FOREIGN KEY (`BatchID`) REFERENCES `BATCH` (`BatchID`),
  CONSTRAINT `quality_control_record_ibfk_2` FOREIGN KEY (`InspectorID`) REFERENCES `INSPECTOR` (`InspectorID`)
) ENGINE=InnoDB AUTO_INCREMENT=250505 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `QUALITY_CONTROL_RECORD`
--

LOCK TABLES `QUALITY_CONTROL_RECORD` WRITE;
/*!40000 ALTER TABLE `QUALITY_CONTROL_RECORD` DISABLE KEYS */;
/*!40000 ALTER TABLE `QUALITY_CONTROL_RECORD` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `REQ`
--

DROP TABLE IF EXISTS `REQ`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `REQ` (
  `QueryID` int NOT NULL AUTO_INCREMENT,
  `ProductID` int DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  PRIMARY KEY (`QueryID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `req_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `PRODUCT` (`ProductID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `REQ`
--

LOCK TABLES `REQ` WRITE;
/*!40000 ALTER TABLE `REQ` DISABLE KEYS */;
/*!40000 ALTER TABLE `REQ` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `RETAILER_REQ`
--

DROP TABLE IF EXISTS `RETAILER_REQ`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `RETAILER_REQ` (
  `Order_no` int NOT NULL AUTO_INCREMENT,
  `Amount` int NOT NULL,
  `BatchID` int NOT NULL,
  `WarehouseID` int NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Location` varchar(100) NOT NULL,
  PRIMARY KEY (`Order_no`),
  KEY `BatchID` (`BatchID`),
  KEY `WarehouseID` (`WarehouseID`),
  CONSTRAINT `retailer_req_ibfk_1` FOREIGN KEY (`BatchID`) REFERENCES `BATCH` (`BatchID`),
  CONSTRAINT `retailer_req_ibfk_2` FOREIGN KEY (`WarehouseID`) REFERENCES `WAREHOUSE` (`WarehouseID`)
) ENGINE=InnoDB AUTO_INCREMENT=70001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RETAILER_REQ`
--

LOCK TABLES `RETAILER_REQ` WRITE;
/*!40000 ALTER TABLE `RETAILER_REQ` DISABLE KEYS */;
/*!40000 ALTER TABLE `RETAILER_REQ` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SUPPLYCHAIN_MOVEMENT`
--

DROP TABLE IF EXISTS `SUPPLYCHAIN_MOVEMENT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SUPPLYCHAIN_MOVEMENT` (
  `MovementID` int NOT NULL AUTO_INCREMENT,
  `BatchID` int NOT NULL,
  `Stage` varchar(50) NOT NULL,
  `CurrentTemprature` decimal(5,2) DEFAULT NULL,
  `Quantity` int DEFAULT NULL,
  PRIMARY KEY (`MovementID`),
  KEY `BatchID` (`BatchID`),
  CONSTRAINT `supplychain_movement_ibfk_1` FOREIGN KEY (`BatchID`) REFERENCES `BATCH` (`BatchID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SUPPLYCHAIN_MOVEMENT`
--

LOCK TABLES `SUPPLYCHAIN_MOVEMENT` WRITE;
/*!40000 ALTER TABLE `SUPPLYCHAIN_MOVEMENT` DISABLE KEYS */;
/*!40000 ALTER TABLE `SUPPLYCHAIN_MOVEMENT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TRANSPORT`
--

DROP TABLE IF EXISTS `TRANSPORT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TRANSPORT` (
  `TransportationID` int NOT NULL AUTO_INCREMENT,
  `Type` varchar(50) DEFAULT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Available` enum('yes','no') DEFAULT 'yes',
  PRIMARY KEY (`TransportationID`)
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TRANSPORT`
--

LOCK TABLES `TRANSPORT` WRITE;
/*!40000 ALTER TABLE `TRANSPORT` DISABLE KEYS */;
/*!40000 ALTER TABLE `TRANSPORT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `TRANSPORT_BATCH`
--

DROP TABLE IF EXISTS `TRANSPORT_BATCH`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TRANSPORT_BATCH` (
  `BatchID` int NOT NULL,
  `TransportationID` int NOT NULL,
  `Quantity` int NOT NULL,
  `Humidity` decimal(5,2) DEFAULT NULL,
  `Temprature` decimal(5,2) DEFAULT NULL,
  KEY `BatchID` (`BatchID`),
  KEY `TransportationID` (`TransportationID`),
  CONSTRAINT `transport_batch_ibfk_1` FOREIGN KEY (`BatchID`) REFERENCES `BATCH` (`BatchID`),
  CONSTRAINT `transport_batch_ibfk_2` FOREIGN KEY (`TransportationID`) REFERENCES `TRANSPORT` (`TransportationID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `TRANSPORT_BATCH`
--

LOCK TABLES `TRANSPORT_BATCH` WRITE;
/*!40000 ALTER TABLE `TRANSPORT_BATCH` DISABLE KEYS */;
/*!40000 ALTER TABLE `TRANSPORT_BATCH` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WAREHOUSE`
--

DROP TABLE IF EXISTS `WAREHOUSE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WAREHOUSE` (
  `WarehouseID` int NOT NULL AUTO_INCREMENT,
  `Capacity` int NOT NULL,
  `WarehouseType` varchar(50) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Location` varchar(100) NOT NULL,
  PRIMARY KEY (`WarehouseID`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WAREHOUSE`
--

LOCK TABLES `WAREHOUSE` WRITE;
/*!40000 ALTER TABLE `WAREHOUSE` DISABLE KEYS */;
/*!40000 ALTER TABLE `WAREHOUSE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WARESTORAGE`
--

DROP TABLE IF EXISTS `WARESTORAGE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WARESTORAGE` (
  `WarehouseID` int DEFAULT NULL,
  `Capacity` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WARESTORAGE`
--

LOCK TABLES `WARESTORAGE` WRITE;
/*!40000 ALTER TABLE `WARESTORAGE` DISABLE KEYS */;
/*!40000 ALTER TABLE `WARESTORAGE` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-11 13:31:36
