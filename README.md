# Phinix - A Pinterest-like MERN Stack App

Phinix is a modern Pinterest-like web application built using the MERN stack. Users can register, log in, create and save posts (pins), organize them into boards, and update their profiles.

## Features

- **User Authentication**: Register and login functionality using JWT.
- **Create Pins**: Users can add posts with images and descriptions.
- **Boards**: Create and save pins into boards.
- **Update Profile**: Users can modify their details.
- **Modern UI**: Built with React and Tailwind CSS for a sleek user experience.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT & Bcrypt
- **Styling**: Tailwind CSS
- **Concurrent Execution**: Using `concurrently` to run both client and server simultaneously

## Folder Structure

```
phinix/
├── client/   # Frontend (React + Vite)
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/   # Backend (Node.js + Express)
│   ├── models/
│   ├── routes/
│   ├── index.js/
│   ├── package.json
│
├── .gitignore
├── README.md
├── package.json
```

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/phinix.git
cd phinix
```

### 2. Install dependencies
#### Client (Frontend)
```bash
cd client
npm install
```
#### Server (Backend)
```bash
cd ../server
npm install
```

### 3. Start the application
Run both client and server concurrently:
```server
cd ../server
npm run dev
```

## Scripts
- `npm run dev` - Starts both frontend and backend using `concurrently`
- `npm start` - Starts React frontend
- `node index.js` - Starts Express backend

## Contributing
Feel free to fork this project and submit pull requests. Any contributions to improve the app are welcome!

## License
MIT License

---
Made with ❤️ by [Vishal Malviya]

