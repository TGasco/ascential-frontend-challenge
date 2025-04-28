# Ascential Frontend App

### [👉 Go to the challenge 👈](./CHALLENGE.md)

### [🚀 See the app in action 🚀](http://ascential-frontend-challenge.s3-website-us-east-1.amazonaws.com)

## Develop
- create `.env` file based on `.env.sample`
- run `yarn` to install dependencies
- run `yarn dev` to start development environment

## Build
- run `yarn` to install dependencies
- run `yarn build` to build app for production
- output is in `dist` directory,
  [ready to be deployed](https://create-react-app.dev/docs/deployment/)

## Data
All data is fetched from the SeatGeek API at
[seatgeek.com](https://platform.seatgeek.com/). Update: The SeatGeek API docs are now behind a login, but can still be accessed by using the [Wayback Machine](https://web.archive.org/web/20240415213440/http://platform.seatgeek.com/).

## Technologies
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Frontend build tooling
- [Chakra UI](https://chakra-ui.com/) - Design system and component library,
  with [Emotion](https://emotion.sh), its peer dependency
- [SWR](https://swr.now.sh/) - Data fetching and caching library
