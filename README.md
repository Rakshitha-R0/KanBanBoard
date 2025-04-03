# Kanban Board

This is a Kanban Board application built with React, utilizing drag-and-drop functionality powered by the `@dnd-kit` library. The application allows users to manage tasks across multiple columns, add new tasks, modify existing tasks, and organize tasks by dragging them between columns.

## Features

- **Drag-and-Drop**: Easily move tasks between columns using drag-and-drop functionality.
- **Task Management**: Add, modify, and delete tasks within columns.
- **Column Management**: Add, modify, and delete columns dynamically.
- **Responsive Design**: Fully responsive layout using SASS for styling.
- **Persistent State**: Task and column data are stored in `sessionStorage` for persistence across page reloads.

## Technologies Used

- **React**: Frontend library for building the user interface.
- **@dnd-kit**: Drag-and-drop library for managing task movement.
- **SASS**: Preprocessor for managing styles.
- **React Context API**: For state management across the application.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/kanban-board.git
   cd kanban-board
   ```

2. Install dependencies using Yarn:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn start
   ```

4. Open the application in your browser at [http://localhost:3000](http://localhost:3000).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `yarn test`

Launches the test runner in interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.\
It bundles React in production mode and optimizes the build for the best performance.

### `yarn eject`

**Note: This is a one-way operation. Once you `eject`, you can't go back!**

## Folder Structure

```
kanban-board/
├── public/               # Static files
├── src/
│   ├── components/       # React components
│   │   ├── AddColumn/    # AddColumn component
│   │   ├── AddTask/      # AddTask component
│   │   ├── Column/       # Column component
│   │   ├── KanbanBoard/  # KanbanBoard component
│   │   └── Task/         # Task component
│   ├── context/          # Context API for state management
│   ├── index.css         # Global styles
│   ├── App.js            # Main application component
│   └── index.js          # Entry point
├── package.json          # Project metadata and dependencies
└── README.md             # Project documentation
```

## Customization

- **Styling**: The project uses SASS for styling. You can modify the `.scss` files in the `src/components` directory to customize the styles.
- **State Management**: The application uses React Context API for managing state. You can extend the `Context.js` file to add more features.

## Contributing

Contributions are welcome! If you have suggestions or improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [@dnd-kit](https://dndkit.com/)
- [SASS](https://sass-lang.com/)

