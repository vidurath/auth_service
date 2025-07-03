# AUTH Service

## How to Run

### Using Docker

1. Ensure you have Docker and Docker Compose installed.
2. Navigate to the `auth_service` directory in your terminal.
3. Run the command: `docker compose up --build`
   This will start the PostgreSQL database and the API service.

### Without Docker

1. Ensure you have Node.js installed.
2. Navigate to the `auth_service` directory in your terminal.
3. Install dependencies: `npm install`
4. Start the server: `npm start`

**Important Note:** Remember to replace the `.env.example` file with `.env` and fill in the necessary credentials.

## Configuration Details

The application uses the following environment variables, which can be configured in the `.env` file:

*   **Server Port:** `SERVER_PORT` (default: 3100) - The port the API server listens on.
*   **Database:**
    *   **Host:** `DB_HOST` (default: 'host.docker.internal')
    *   **Port:** `DB_PORT` (default: 5465)
    *   **User:** `DB_USER` (default: 'postgres')
    *   **Password:** `DB_PASSWORD` (default: 'root*123')
    *   **Database Name:** `DB_NAME` (default: 'blogvid')
    *   **Schema:** `DB_SCHEMA` (default: 'auth')


