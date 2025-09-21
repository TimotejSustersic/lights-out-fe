# Lights Out Game (Frontend)

## Project Description

Angular frontend project for the Lights Out puzzle game. The application allows users to create and solve Lights Out problems with a responsive UI. It integrates with a Quarkus backend via REST APIs to handle game logic and storage.

---

## 🔧 Tech Stack

| Layer       | Tech                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| Framework   | [Angular 20.3.1](https://angular.io/)                                      |
| UI Styling  | [Tailwind CSS](https://tailwindcss.com/) / [DaisyUI](https://daisyui.com/) |
| E2E Testing | [Cypress](https://www.cypress.io/)                                         |

---

## ⚙️ Setup & Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/TimotejSustersic/lights-out-fe.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the dev server**

   ```bash
   npm start
   ```

Access the app at [http://localhost:4200](http://localhost:4200).

The app connects to the backend at `http://localhost:8080` by default.
If your backend runs elsewhere, update `proxy.conf.json`.

---

## 📂 Project Structure

```
src/
 ├── app/
 │   ├── components/
 │   │   ├── board/              # Board component
 │   │   └── event-popup/        # Popup component
 │   ├── pages/
 │   │   ├── problems/           # Problem page
 │   │   └── solutions/          # Solutions page
 │   ├── services/api.ts         # REST API integration
 │   ├── app.config.ts           # Routing
 │   └── theme.service.ts        # Dark mode
 ├── schemas/                    # DTOs for endpoints
 │   ├── problems.ts
 │   └── solutions.ts
```

---

## 🚀 Features & Functionality

* **Problem Creation Page**
  Users can create new problems on grid sizes ranging from 3×3 to 8×8. Problems are submitted to the backend for validation, after which users are notified whether the problem is solvable. The app also shows how many moves are required to solve the problem and how long the algorithm took to find the solution.

* **Problem Solving & Solutions Page**
  Displays a table of previously created problems sorted by size, with details like size, difficulty, and creation date. Users can select a problem to play Lights Out interactively. The goal is to turn on all the lights. The UX tracks the number of moves and the time taken to complete the problem. If a problem is too difficult, the user can access the solution.

---

## 🧪 Testing

The frontend is tested with **Cypress** for end-to-end (E2E) testing, ensuring that user interactions and API integrations work as expected. Tests are organized into three suites:

* **Board Toggle Functionality** (`board-toggle.cy.ts`):

  * Tests toggling each cell in a 3×3 grid, verifying correct state changes.
  * Verifies double-click and rapid-click behavior.

* **Solutions Listing Page** (`solutions-listing.cy.ts`):

  * Ensures problem selection works and displays a placeholder when no selection is made.
  * Tests problem solutions and completion flow.
  * Uses `cy.clock` to simulate time passage for timer tests.

* **Problem Creation Page** (`problem-creation.cy.ts`):

  * Tests cell toggling, grid reset, and grid size changes (e.g., 4×4 grid has 16 cells).
  * Verifies submission of solvable/unsolvable problems with appropriate notifications.
  * Tests loading state during evaluation using delayed API mocks.

### Running Tests

1. **[Run](#️-setup--installation) the server.**

2. **Run Cypress tests:**

   ```bash
   npx cypress open
   ```

---

## 👨‍💻 Author

**Timotej Šušteršič**

* [GitHub](https://github.com/TimotejSustersic/)

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
