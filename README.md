**Daisy**
Brief description of your project.

## Third-Party Libraries & APIs

This project uses the following third-party libraries and APIs:

### Frontend Libraries

#### **React** (v18.x)
- **Source:** https://react.dev/
- **License:** MIT
- **Purpose:** JavaScript library for building user interfaces
- **Usage:** Core framework for all UI components
- **Citation:** Used throughout all `.jsx` files in the `/src` directory
- **Installation:** `npm install react react-dom`

#### **Tailwind CSS** (v3.x)
- **Source:** https://tailwindcss.com/
- **License:** MIT
- **Purpose:** Utility-first CSS framework
- **Usage:** Styling all components using utility classes
- **Citation:** Used in `className` attributes throughout components; configured in `tailwind.config.js`
- **Installation:** `npm install -D tailwindcss postcss autoprefixer`

### Backend Libraries

#### **Node.js** (v18.x or higher)
- **Source:** https://nodejs.org/
- **License:** MIT
- **Purpose:** JavaScript runtime environment
- **Usage:** Backend server runtime
- **Citation:** Used to run server code

#### **Express** (v4.x)
- **Source:** https://expressjs.com/
- **License:** MIT
- **Purpose:** Web application framework for Node.js
- **Usage:** HTTP server, routing, and middleware
- **Citation:** `server/server.js` or `server/app.js`
- **Installation:** `npm install express`

#### **MongoDB** (v6.x or v7.x)
- **Source:** https://www.mongodb.com/
- **License:** Server Side Public License (SSPL)
- **Purpose:** NoSQL database
- **Usage:** Storing and querying application data (products, brands, etc.)
- **Citation:** Database connection in `server/database.js` or similar
- **Installation:** Requires MongoDB server installation

#### **Mongoose** (v8.x)
- **Source:** https://mongoosejs.com/
- **License:** MIT
- **Purpose:** MongoDB object modeling library
- **Usage:** Schema definition, validation, and database queries
- **Citation:** Model files in `/server/models/` directory
- **Installation:** `npm install mongoose`

### Additional npm packages

#### **cors** (v2.x)
- **Source:** https://www.npmjs.com/package/cors
- **License:** MIT
- **Purpose:** Enable Cross-Origin Resource Sharing
- **Usage:** Allow frontend to make requests to backend API
- **Citation:** `server/server.js` - `app.use(cors())`
- **Installation:** `npm install cors`

#### **dotenv** (v16.x)
- **Source:** https://www.npmjs.com/package/dotenv
- **License:** BSD-2-Clause
- **Purpose:** Load environment variables from .env file
- **Usage:** Managing configuration secrets (database URLs, API keys)
- **Citation:** `server/server.js` - `require('dotenv').config()`
- **Installation:** `npm install dotenv`

#### **React Router** (v6.x)
- **Source:** https://reactrouter.com/
- **License:** MIT
- **Purpose:** Client-side routing library
- **Usage:** Navigation between pages/views
- **Citation:** `src/App.jsx` and route component files
- **Installation:** `npm install react-router-dom`

### Authentication Packages 
### Google OAuth
- Client Secret must be kept secret and never committed to version control
- Use `.env` file for credentials (included in `.gitignore`)
- Always use HTTPS in production
- Validate redirect URIs in Google Console
- Limit OAuth scopes to minimum required (profile, email)

### Session Management
- Use strong session secret (generate with `require('crypto').randomBytes(64).toString('hex')`)
- Set secure cookie options in production:
  ```javascript
  cookie: {
    secure: true,        // Require HTTPS
    httpOnly: true,      // Prevent XSS
    maxAge: 24*60*60*1000, // 24 hours
    sameSite: 'lax'     

### Development Tools

#### **Vite** (v4.x or v5.x)
- **Source:** https://vitejs.dev/
- **License:** MIT
- **Purpose:** Build tool and development server
- **Usage:** Fast development environment and production builds
- **Citation:** `vite.config.js` and `package.json` scripts
- **Installation:** `npm create vite@latest`

## Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB v6 or higher (if using MongoDB)
- npm or yarn package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd [project-name]
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/your-database
   PORT=5000
   # Add other environment variables as needed
   ```

5. **Run the application**
   
   Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```
   
   Terminal 2 (Backend):
   ```bash
   cd server
   npm start
   ```
   
---

## Code Attribution

### Custom Components
- **Autocomplete Components** (`ProductAutocomplete.jsx`, `BrandAutocomplete.jsx`)
  - Custom implementation using React hooks
  - ARIA accessibility patterns from W3C WAI-ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

### Algorithms
- **Fuzzy Search** (`fuzzySearch.js`)
  - Levenshtein distance algorithm based on:
    - Levenshtein, Vladimir I. (1966). "Binary codes capable of correcting deletions, insertions, and reversals"
  - Implementation adapted from common JavaScript patterns

---


## Acknowledgments

- React team at Meta for the React framework
- Tailwind Labs for Tailwind CSS
- MongoDB Inc. for the MongoDB database
- Express.js team for the Express framework
- Google for OAuth 2.0 authentication services
- All other open-source contributors whose libraries made this project possible
