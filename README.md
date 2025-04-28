# Ascential Frontend App

### [👉 Go to the challenge 👈](./CHALLENGE.md)

### [🚀 See the app in action 🚀](http://ascential-frontend-challenge.s3-website-us-east-1.amazonaws.com)

## Overview
This is a React app that uses the SeatGeek API to display events and venues. It is built with Vite and Chakra UI, and uses SWR for data fetching.

This improved implementation includes the following features:
- **Date and Time Display Fix**: The event datetime is now displayed in the local timezone of the event location, with the user's timezone shown as a tooltip on hover.
- **Favorites Feature**: Users can mark events or venues as favorites from both the list and details pages. A slide-in drawer displays the list of favorite items for easy access, and users can navigate to favorite items directly from the list. Items can be removed from the favorites list within the list and on the details page, and the favorites list is persisted even after the app is closed.
- **Infinite Scroll**: The app now supports infinite scrolling for the events and venues lists, allowing users to load more items as they scroll down the page, enhancing the user experience and making it easier to explore a larger number of events and venues.

## Develop
- create `.env` file based on `.env.sample`
- run `yarn` to install dependencies
- run `yarn dev` to start development environment

## Build
- run `yarn` to install dependencies
- run `yarn build` to build app for production
- output is in `dist` directory,
  [ready to be deployed](https://create-react-app.dev/docs/deployment/)

## Test
- run `yarn vitest` to run the test suite

## Data
All data is fetched from the SeatGeek API at
[seatgeek.com](https://platform.seatgeek.com/). Update: The SeatGeek API docs are now behind a login, but can still be accessed by using the [Wayback Machine](https://web.archive.org/web/20240415213440/http://platform.seatgeek.com/).

## Technologies
- [React](https://reactjs.org/) - UI library
- [Vite](https://vitejs.dev/) - Frontend build tooling
- [Chakra UI](https://chakra-ui.com/) - Design system and component library,
  with [Emotion](https://emotion.sh), its peer dependency
- [SWR](https://swr.now.sh/) - Data fetching and caching library
