# Zeta

Zeta is an interactive web application designed to help beginners learn Python programming. It combines guided coding challenges with two ways to write programs: a visual block-based editor and a traditional text editor.

The project is split into a React frontend and a Node.js/Express backend. The backend runs submitted Python snippets and provides a lightweight API for retrieving and updating learning progress.

## Features

- **Learn Python through challenges** — progress through levels with instructions and hints.
- **Two programming modes** — write Python directly or assemble programs using draggable visual blocks.
- **Live code execution** — send Python code to the backend and display standard output and errors.
- **Automatic answer checking** — compare program output with the expected result for each challenge.
- **Progress and stars** — track completed levels using a simple user-progress store.
- **Responsive interface** — built with React and React Bootstrap.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, TypeScript, JavaScript |
| UI | React Bootstrap, Bootstrap 5 |
| Routing | React Router |
| Backend | Node.js, Express 5 |
| Python execution | Local Python 3 interpreter |
| User progress | JSON file storage |

## Project structure

```text
Zeta/
├── cliente/                   # React frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/         # Editors, blocks, results, levels and stars
│       ├── css/
│       ├── pages/
│       │   └── levels/         # Individual learning challenges
│       ├── App.js
│       └── index.js
├── server/                    # Express backend
│   ├── controller/            # HTTP request handlers
│   ├── routes/                 # API routes
│   ├── service/                # Python execution and data helpers
│   ├── dataUser.json          # User progress data
│   └── index.js
├── FileTree.md
└── README.md
```

## Requirements

Install the following before running the project:

- [Node.js](https://nodejs.org/) (Node.js 18 or newer recommended)
- npm
- [Python 3](https://www.python.org/downloads/) available on your system PATH

The backend invokes `python` on Windows and `python3` on other operating systems. Make sure the corresponding command works in your terminal.

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/Gr33d0/Zeta.git
cd Zeta
```

### 2. Install frontend dependencies

```bash
cd cliente
npm install
```

### 3. Install backend dependencies

Open a second terminal from the project root:

```bash
cd server
npm install
```

### 4. Start the backend

From the `server/` directory:

```bash
npm start
```

The API server starts at:

```text
http://localhost:3001
```

### 5. Start the frontend

From the `cliente/` directory, in the other terminal:

```bash
npm start
```

The React development server is available at:

```text
http://localhost:3000
```

The frontend is configured to communicate with the backend at `http://localhost:3001`. The backend CORS configuration currently allows requests from `http://localhost:3000`.

## API

The backend exposes its routes under the `/api` prefix.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/run` | Execute submitted Python code and return its output, errors and exit status. |
| `GET` | `/api/getDataUser/:id` | Retrieve a user's star count. |
| `PATCH` | `/api/updateDataUser/:id` | Create or update a user's progress and increment their stars. |

### Execute Python code

Request:

```http
POST /api/run
Content-Type: application/json
```

Body:

```json
{
  "code": "print('Hello, world!')"
}
```

Example response:

```json
{
  "stdout": "Hello, world!\\n",
  "stderr": "",
  "exitCode": 0,
  "timedOut": false
}
```

The backend rejects empty submissions and code longer than 50,000 characters. Python execution has a five-second timeout and a one-megabyte output buffer.

### Retrieve user progress

```http
GET /api/getDataUser/1
```

Example response:

```json
{
  "stars": 2
}
```

### Update user progress

```http
PATCH /api/updateDataUser/1
Content-Type: application/json
```

The current implementation creates a user record if it does not exist and increments the star count when the record is updated.

## How the application works

1. A learner selects a challenge from the levels page.
2. The challenge provides instructions and an expected output.
3. The learner writes code in the text editor or builds it using visual blocks.
4. The frontend sends the generated Python source to `POST /api/run`.
5. The backend writes the snippet to a temporary file and executes it with the local Python interpreter.
6. The result is returned to the frontend and displayed.
7. The challenge checks the output against its expected result and updates progress when the answer is accepted.

## Development notes

- Frontend and backend dependencies are managed independently; run `npm install` in both `cliente/` and `server/`.
- User progress is stored in `server/dataUser.json`, rather than in a database.
- The current frontend uses local storage for the `userStars` value and sends a user ID when updating progress.
- The Python execution endpoint runs code on the machine hosting the backend. It is intended for a controlled learning/demo environment, not for exposing to untrusted users as-is.

## Security considerations

**Do not deploy the Python execution endpoint to a public environment without additional isolation.** A timeout and output-size limit do not constitute a security sandbox. Submitted Python code is executed as a local process with the backend server's operating-system permissions. A production deployment should use a properly isolated execution environment (for example, a locked-down container or dedicated sandbox), resource limits, restricted filesystem and network access, and appropriate request controls.

The current progress API is also a simple prototype: it does not provide authentication or authorization, and its JSON file storage is not designed for concurrent or multi-instance production use.

## Tests and builds

Frontend scripts are available from `cliente/`:

```bash
npm test
npm run build
```

The backend currently has no automated test suite configured.

## Contributing

Contributions and suggestions are welcome:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes.
4. Push the branch and open a pull request.

## Author

**Jonas Vinagre Gomes**

## License

The backend package declares the ISC license. Check the repository's licensing terms before redistributing the project.
