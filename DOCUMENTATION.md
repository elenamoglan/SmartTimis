# SmarTimis Documentation

## Technical Overview

SmarTimis is a web application designed to empower citizens to report and track local issues (like potholes, broken streetlights, etc.) and facilitate collaboration with local authorities.

### Technology Stack

**Frontend**
*   **Framework:** [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Maps:** [Leaflet](https://leafletjs.com/) with `react-leaflet`
*   **Routing:** React Router DOM
*   **Icons:** Lucide React
*   **HTTP Client:** Axios
*   **PDF Generation:** jsPDF & jsPDF-AutoTable

**Backend**
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** PostgreSQL with PostGIS extension (for spatial queries)
*   **Authentication:** JWT (JSON Web Tokens)

**Infrastructure**
*   **Containerization:** Docker & Docker Compose

### Architecture

The application follows a standard Client-Server architecture:
1.  **Frontend (Client):** Single Page Application (SPA) serving the UI. It communicates with the backend via a RESTful API.
2.  **Backend (Server):** Handles business logic, authentication, and database interactions.
3.  **Database:** Stores user data, issue reports, and spatial coordinates.

### Database Schema

**`users` Table**
*   `id`: Primary Key
*   `name`: Full name of the user
*   `email`: Unique email address
*   `password_hash`: Securely hashed password
*   `role`: 'CITIZEN' or 'ADMIN'
*   `created_at`: Timestamp

**`issue_reports` Table**
*   `id`: Primary Key
*   `user_id`: Foreign Key referencing `users(id)`
*   `title`: Short title of the issue
*   `description`: Detailed description
*   `image_url`: Path/URL to an image of the issue
*   `latitude` & `longitude`: Geo-coordinates
*   `status`: 'OPEN', 'IN_PROGRESS', 'RESOLVED'
*   `likes_count`: Number of upvotes
*   `created_at`: Timestamp
*   `updated_at`: Timestamp

**`issue_likes` Table**
*   `user_id`: Foreign Key
*   `issue_id`: Foreign Key

---

## User Manual

### 1. Getting Started

**Accessing the Platform**
*   Navigate to the Landing Page to see an overview of the "SmarTimis" initiative.
*   **Register:** Click "Get Started" or "Sign Up" to create a new account. You will need to provide your Name, Email, and a Password.
*   **Login:** If you already have an account, click "Sign In".

### 2. Citizen Features

**Dashboard**
*   After logging in, you are directed to the main Dashboard.
*   **Interactive Map:** View markers for all reported issues in your area. Click a marker to see details.

**Reporting an Issue**
1.  Click the "Report Issue" button in the navigation bar.
2.  **Details:** Enter a descriptive Title and Description.
3.  **Location:** Click on the map to pinpoint the exact location of the issue. A marker will appear.
4.  **Submit:** Click the "Submit Report" button. Your issue is now saved and visible to admins.

**Notifications**
*   Click the **Bell Icon** in the top-right corner to view notifications about your reported issues (e.g., when an admin changes the status).

### 3. Admin Features

**Admin Dashboard**
*   Admins have access to a dedicated dashboard via the "Admin Dashboard" link.
*   **Statistics:** View cards showing the count of Pending, In Progress, and Resolved issues.
*   **Activity Chart:** A bar chart visualizes reporting activity over the last 7 days.

**Managing Issues**
*   The dashboard displays a table of all reported issues.
*   **Update Status:** Use the dropdown menu in the "Action" column to change an issue's status (e.g., from 'OPEN' to 'IN_PROGRESS'). This triggers a notification to the reporter.

**Exporting Reports**
*   **PDF Download:** Click the "Download PDF" button above the reports table to generate and download a PDF summary of all current issues.
