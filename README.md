# Tellygram Chat App

A Real Time Chat App.

## Features

- Authentication using username and password
- Private messaging
- Group messaging
- Ability to create private groups
- Ability to delete or leave groups
- Ability to add or remove group participants
- Notification for different events
- Error message handler

## Preview

You can see the live website here:
- [Backend (Heroku)](https://tellygram-backend.herokuapp.com/)
- [Frontend (Netlify)](https://tellygram.anubhavvs.me/)

## Built With

### Front-End
- [ReactJS](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/) 
- [Apollo Subscriptions](https://www.apollographql.com/docs/react/data/subscriptions/)
- [Yup](https://github.com/jquense/yup)
- [React Hook Form](https://react-hook-form.com/)
- [React Custom Scrollbars](https://github.com/malte-wessel/react-custom-scrollbars)
- [Date-fns](https://date-fns.org/)

### Back-End
- [Apollo Server](https://www.apollographql.com/docs/apollo-server/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [GraphQL](https://graphql.org/)
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)

## Installation

### Back-End
1. Make sure you have [PostgreSQL](https://www.postgresql.org/) and [NodeJS](https://nodejs.org/en/) locally installed on your machine.
2. Install all the dependencies.

    ```
    cd server
    npm install
    ```
3. Create .env file in [Server](server/) directory.

    ```
    PORT = 4000
    JWT_SECRET = "your jwt secret"
    ```
4. Migrate and seed the  SQL tables to your local database.

    ```
    npm run migrate
    npm run seed
    ```
5. Edit the [config file](server/config/config.json) to match your local database credentials.
6. Run the sever.
    ```
    npm run dev
    ```

### Front-End
1. Install all the dependencies.

    ```
    cd client
    npm install
    ```
2. Edit the [client file](client/src/apolloClient.js) to match the server URLs. In production, change them from `localhost` to the deployed server URLs.

    ```
    const http = 'http://localhost:4000'
    const ws = 'ws://localhost:4000/graphql'
    ```

## Updates
These are few upcoming updates that I have planned to provide in the future.

- [ ] Responsive layout
- [ ] PWA Support
- [ ] Ability to update group names
- [ ] Encryption of messages
- [ ] Tenor GIF support