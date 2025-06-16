# Truth or Fake – Technical Test

This project is a React application developed as part of a technical test. It is an interactive game where the user must guess whether a displayed piece of advice is true or false. The interface uses the [Mantine](https://mantine.dev/) library for a modern and responsive UI.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installing Dependencies

Install the project dependencies with:

```sh
npm install
```

Main dependencies include:
- [React](https://react.dev/): UI library
- [Mantine](https://mantine.dev/): Modern React UI components
- [Vite](https://vitejs.dev/): Fast development tool for React/TypeScript

## Running the Project in Development Mode

To start the development server:

```sh
npm run dev
```

The project will be available at the address shown in your terminal (default: http://localhost:5173).

## Useful Scripts

- `npm run dev`: start the development server
- `npm run build`: build the project for production
- `npm run preview`: locally preview the production build

## Project Structure

- `src/components/`: reusable components (GameBoard, GameHistory, etc.)
- `src/hooks/`: custom hooks
- `src/types/`: TypeScript definitions
- `src/utils/`: utility functions
- `public/`: static files

## Notes

This project was created as part of a technical test.  
Feel free to browse the source code for more implementation details.

---

© 2025 – React/TypeScript/Mantine Technical Test

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
