# Application to translate and manage FAQs 

## Overview
This backend application is built using Node.js and Express. It serves as a tranlator and manager for the storage and retrival of FAQs.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [API Usage Examples](#api-usage-examples)
- [Contribution Guidelines](#contribution-guidelines)

## Features
- RESTful API endpoints for data management
- Integration with Google Cloud Translation for language translation
- Used Redis for data caching
- Used eslint for linting
- Testing framework using Mocha and Chai for unit and integration tests

## Installation

Follow these steps to set up the application locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PranuPranjal/faq-translator
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add your configuration settings. For example:
   ```plaintext
   MONGO_URI=your_database_url
   REDIS_URL=your_redis_url
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

5. **Run tests** (optional):
   ```bash
   npm test
   ```

## API Usage Examples

### Base URL
The base URL for the API is `http://localhost:5000/api`.

### Example Endpoints

#### 1. Retrive existing FAQs
- **Endpoint**: `GET /api/faq?lang=desiredLanguage`
- **Description**: Displays all the existing FAQs in the language desired by user.
- **Request Body**:
  ```json
  {
    "Lang": "Traget language"
  }
  ```
- **Response**:
  ```json
  {
    "question": "Translated question",
    "answer": "Translated answer",
    "id": "faqId"
  }
  ```
- **Example cURL Command**:
  ```bash
  curl http://localhost:5000/api/faq?lang=desiredLanguage
  ```


#### 2. Add more FAQs
- **Endpoint**: `POST /api/faq`
- **Description**: Lets admin add more FAQs to the database.
- **Request Body**:
  ```json
  {
    "question": "Input question", 
    "answer": "Input answer", 
    "translations": { "languages whose translation is needed" }
   }
  ```

- **Example cURL Command**:
  ```bash
  curl http://localhost:5000/api/faq
  ```

#### 2. Delete existing FAQ
- **Endpoint**: `POST /api/faq/faqId`
- **Description**: Lets admin delete existing FAQ to the database.
- **Request Body**:
  ```json
  { 
    "faqId": "Input Faq's Id"
   }
  ```

- **Example cURL Command**:
  ```bash
  curl http://localhost:5000/api/faq/faqId
  ```

## Contribution Guidelines

Contributions are welcome to this project! Please follow these guidelines:
1. ***Fork the repository**:
   Click the "Fork" button at the top right corner of the repository page to create a personal copy of the project.
2. **Clone the repository**: 
   ```bash
   git clone repo_url
   cd backend
   ```
3. **Create a new branch**: 
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Commit your changes**: 
   ```bash
   git commit -m "Add your commit message"
   ```
5. **Push to your branch**: 
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a pull request**: 
   Go to the original repository and click on "New Pull Request".