# CheckInPro Clone Project

This project is a simplified clone of the CheckInPro website, consisting of a backend API built with Node.js and Express, and a frontend built with plain HTML, CSS, and JavaScript. The project demonstrates a basic full-stack web application where users can register, log in, and record check-ins.

## Project Structure

- `backend/`:
  - `server.js` – Main Express server file.
  - `package.json` – Dependencies and scripts for the Node.js backend.

- `frontend/`:
  - `index.html` – Frontend web page with a hero section, feature descriptions, registration and login forms.

- `README.md` – Project description and setup instructions.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 14 or higher) should be installed on your machine.

## Setup and Run

1. **Clone the repository** (or extract the ZIP file).

2. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Start Backend Server**:
   ```bash
   npm start
   ```
   By default, the server runs on `http://localhost:3000`.

4. **Open the Frontend**:
   - You can open the `frontend/index.html` file directly in your browser.
   - For a smoother experience with API calls, consider serving it with a simple HTTP server (e.g., using `python -m http.server` in the `frontend` directory) so the fetch requests can communicate with the backend.

5. **Usage**:
   - Navigate to the registration section to create a new account.
   - Use the login section to authenticate.
   - The backend includes endpoints for recording check-ins (`/api/checkin`) and retrieving check-ins for a user (`/api/checkin/:username`).

## Notes

- This is a basic demonstration project. For a production-ready app, you would typically use a database instead of an in-memory array, add authentication tokens, hashing passwords, input validation, and a more sophisticated frontend framework like React or Vue.

- The design is minimal and can be extended or customized as desired.

## License

This project is provided for educational purposes and does not include any proprietary assets from CheckInPro.
