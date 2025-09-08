# bun-express-ts

A CLI tool to scaffold an **Express + TypeScript + MongoDB** project with support for **Bun** or **npm**.  
This tool generates a boilerplate project so you can start coding your API right away, with sensible defaults and clean structure.

---

## 🚀 Installation

Install globally with npm:

```bash
npm install -g bun-express-ts
```

Or with Bun:

```bash
bun add -g bun-express-ts
```

---

## 📖 Usage

Create a new project:

```bash
create-express-ts my-app
```

Follow the prompts to set:

- Project name
- Description
- MongoDB credentials (optional)
- Whether to auto-install dependencies

Move into your new project:

```bash
cd my-app
```

Run the project in development:

```bash
npm run dev
# or
bun run dev
```

---

## 📂 What You Get

- **Express server** preconfigured with TypeScript
- **MongoDB connection** with `.env` setup
- **Scripts** for development, build, and start
- **Preconfigured folder structure**:

  ```
  src/
   ├── index.ts       # Entry point
   ├── routes/        # Example routes
   ├── controllers/   # Example controllers
   ├── middlewares/   # Example Validation
   ├── config/        # Example DB

  ```

---

## 🔧 Features

- TypeScript out of the box
- Express 5.x ready
- MongoDB connection URI handling
- Works with **Bun** or **npm**
- Interactive scaffolding (choose project name, description, DB, etc.)

---

## 📝 Example

```bash
create-express-ts my-api
cd my-api
bun run dev
```

This will start a development server with hot-reloading.

---

## 🤝 Contributing

PRs and issues are welcome on [GitHub](https://github.com/alibad98/create-express-ts).

---

## 📝 License

MIT License

Copyright (c) 2025 Ali Badawi
