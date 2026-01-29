# Deployment Guide

This guide explains how to deploy the SmartCity "SmarTimis" application for production use or for access from other devices on your local network.

## Prerequisites

*   [Docker](https://docs.docker.com/get-docker/) installed on your machine.
*   [Docker Compose](https://docs.docker.com/compose/install/) installed.

## Quick Start (Production Mode)

To start the application in a production-like environment (optimized, stable):

1.  Open your terminal in the project root.
2.  Run the following command:

    ```bash
    docker-compose -f docker-compose.prod.yml up -d --build
    ```

    *   `-f docker-compose.prod.yml`: Specifies the production configuration file.
    *   `up`: Starts the containers.
    *   `-d`: Detached mode (runs in the background).
    *   `--build`: Forces a rebuild of the images (ensures latest code is used).

3.  Wait a few moments for the database to initialize and the application to build.

## Accessing the Application

### From the Host Machine
Open your browser and navigate to:
[http://localhost:8080](http://localhost:8080)

### From Other Devices (Local Network)
To access the application from your phone or another computer on the same WiFi/network:

1.  **Find your computer's local IP address:**
    *   **Windows:** Open Command Prompt (`cmd`) and run `ipconfig`. Look for "IPv4 Address" (e.g., `192.168.1.15`).
    *   **Mac/Linux:** Open Terminal and run `ifconfig` or `ip addr`. Look for `inet` under `en0` or `wlan0`.

2.  **Open the browser on the other device:**
    Enter `http://<YOUR_IP_ADDRESS>:8080`
    *   Example: `http://192.168.1.15:8080`

**Note:** Ensure your computer's firewall allows incoming connections on port 8080.

## Stopping the Application

To stop the containers:

```bash
docker-compose -f docker-compose.prod.yml down
```

## Data Persistence

*   **Database:** Data is stored in a Docker volume named `smartcity_db_data_prod`. It persists even if you restart containers.
*   **Uploads:** Images uploaded by users are stored in the `smartcity_uploads_data` volume.

## Troubleshooting

*   **Port Conflicts:** If port 8080 is already in use, edit `docker-compose.prod.yml` and change `"8080:80"` to another port (e.g., `"8081:80"`).
*   **Database Errors:** If you see database connection errors, check the logs: `docker-compose -f docker-compose.prod.yml logs backend`.
