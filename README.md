# Snake-Game-2D
The main purpose of the project is to write the project based on Functional Programming paradigm. The project itself is a Snake Game in 2D.
The Snake-Game-2D is built on the Webpack.

### Rules of the game
At the start of the game, a field appears on which a snake and an apple are drawn. Each time a snake crosses a cell with an apple, the snake increases in size by one cell. If the snake collides with itself, it is game over.

What is used:

- Programming languages: HTML, CSS, JavaScript ES6;
- Bundler: Webpack;
- Preprocessor: SCSS;
- Libraries: Babel, ESLint;

To clone repository
```shell
git clone https://github.com/User-960/Snake-Game-2D.git
```

To install packages
```shell
npm install
```
***
\* Before start project you need to make file `.env` in root of project and copy from file `.env.example` variables with meanings in new file. Or you can write your own meanings for variables in file `.env`

## Commands

### Launching a development server
```shell
npm run start
```

### Building a project without optimization
```shell
npm run build-dev
```

### Building a project with optimization
```shell
npm run build-prod
```

### Cleaning up the dist folder
```shell
npm run clear
```

### Checking the src folder for an error according to the set of rules
```shell
npm run eslint
```
