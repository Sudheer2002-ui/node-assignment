Node.js Backend Assignment
A simple REST API backend built using Node.js, TypeScript, and MongoDB without any frameworks.
Tech Stack
Node.js (HTTP module only)

TypeScript

MongoDB Atlas (Cloud DB)

JSONPlaceholder API (Dummy data)

Setup Instructions
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/Sudheer2002-ui/node_assignment.git
cd node_assignment
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure MongoDB
Update your MongoDB connection string in:

bash
Copy
Edit
src/utils/mongo.ts
ts
Copy
Edit
export const mongoUrl = "your-mongodb-atlas-uri";


4. Run the Server
bash
Copy
Edit
npx ts-node src/index.ts
Server runs at:
http://localhost:3000

API Endpoints
GET /load
Loads 10 users + their posts + comments into MongoDB

Returns: 200 OK on success

GET /users/:userId
Returns user details including posts and comments

PUT /users
Inserts a new user

Body: JSON user object

Error: 409 Conflict if user already exists

DELETE /users
Deletes all users

DELETE /users/:userId
Deletes a specific user

Testing (with curl)
bash
Copy
Edit
curl -X GET https://your-url.onrender.com/load
curl -X GET https://your-url.onrender.com/users/1
curl -X PUT -H "Content-Type: application/json" -d '{...}' https://your-url.onrender.com/users
Project Structure
css
Copy
Edit
src/
├── controllers/
├── routes/
├── services/
├── utils/
└── index.ts
