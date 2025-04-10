<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->


# BotOrganizer - Chatbot with NestJS and Telegram

## Overview

BotOrganizer is a chatbot developed with NestJS that helps you organize your tasks and appointments through Telegram. It allows you to create, list, mark as completed, and set reminders for your tasks, all directly within your Telegram chat.

## Technologies Used

*   **NestJS:** Framework for building efficient and scalable Node.js applications.
*   **TypeScript:** Programming language that offers static typing for greater security and ease of maintenance.
*   **PostgreSQL:** Relational database used for storing tasks.

## Features

*   **Create Tasks:** Create new tasks with a title, description, due date, and priority.
*   **List Tasks:**  View all your tasks in order of priority or due date.
*   **Set Reminders:** Set reminders for specific tasks based on date and time.
*   **Telegram Interface:**  Interact with BotOrganizer through the Telegram bot.
*   **Due Date Management:** Define task due dates.

## How to Use

1.  **Obtain your Telegram Bot Token:**
    *   Create a bot using BotFather on Telegram.
    *   Obtain your bot's token.  You'll need this to configure BotOrganizer.

2.  **Clone the Repository:**
    ```bash
    git clone https://github.com/vinirb15/BotOrganizer.git
    cd BotOrganizer
    ```

3.  **Install Dependencies:**
    ```bash
    npm install
    ```

4.  **Configure the Bot:**
    *   Edit the `.env` file to configure environment variables, including:
        *   `BOT_TOKEN`: Your Telegram Bot Token.
        *   `HOST`: Host of your PostgreSQL database.
        *   `POSTGRES_USER`: PostgreSQL user.
        *   `POSTGRES_PASSWORD`: PostgreSQL password.
        *   `POSTGRES_DB`: Name of your PostgreSQL database.
        *   `ENCRYPT_SALT`: Salt for encrypting sensitive data.
        *   `JWT_SECRET`: Secret key for JWT authentication.
        *   `NODE_ENV`: Environment mode (e.g., local, production).

5.  **Run the Bot:**
    ```bash
    # development
    npm start

    # watch mode
    npm run start:dev

    # production mode
    npm run start:prod
    ```

6.  **Interact with the Bot in Telegram:**
    *   Start a conversation with your bot on Telegram.
    *   Use the bot's commands to create, list, mark as completed, and set reminders for your tasks.

## Improvements and Next Steps

### Fixes
*   **Today’s Events:** Correction to ensure that today’s events are correctly displayed.
*   **Login Expiration:** Extended the login expiration time to 30 days.

### Features
*   **Date & Time Validation:** Implementation of validation to ensure date and time consistency, using the date format without timezone information.
*   **“Today” Option:** Added a "Today" option to the date selection options, making it easier to choose the current day.
*   **Audio Implementation:**  Implementation of audio usage (e.g., for event descriptions, voice messages, etc.).
*   **Group Usage:**  Implementation of the ability to use the chatbot in groups (with privacy and organization considerations).
*   **Add Images to Events:** Capability to add images to events to enrich the presentation and context.
