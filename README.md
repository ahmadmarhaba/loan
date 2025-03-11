# Loan Application

This project is a frontend application for managing loan applications. It is built using Vue.js and Vite.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/ahmadmarhaba/loan.git
   cd loan
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env.local` file in the root directory and add the following variables:

   ```env
   VITE_CURRENCY_API=your_currency_api_key
   VITE_LOAN_API=http://localhost:3003/v1
   ```

## Usage

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Build the project for production:

   ```sh
   npm run build
   ```

3. Preview the production build:

   ```sh
   npm run preview
   ```

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
VITE_CURRENCY_API=your_currency_api_key
VITE_LOAN_API=http://localhost:3003/v1
```

## License

This project is licensed under the ISC License.
