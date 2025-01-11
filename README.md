<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
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
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# Features

- Modular artitechure
- JWT Base Authentication
- Role Based Access Contorol(RBAC) Authorization
- Rate limiter
- TypeScript
- Request Validation
- Error Handling
- Unit Testing
- Database Migrations
- API Documentation (swagger)

## 🛠 Tech Stack

- Node.js
- TypeScript
- Nestjs
- Postgresql with Mikro-orm
- Jest for Testing
- class validator for Validation
- JWT for Authentication
- Swagger for Documentation

## Project Structure

```
project-root/
├── src/
│   ├── config                # basic app config
│   │── decorator             # global decorators
│   │── import                # project imports
│   │       ├── external.ts   # Import external modules
│   │       └── internal.ts   # Import internal modules
│   │── migrations            # Database migrations
│   │── models                # Database Models
│   ├── modules               # App Modules
│   ├── seeders               # Database Seeders
├── types                     # Application (interfaces,types,...)
└── uploader                  # config for uploader(multer)
```

## Packages

- [Nestjs](https://nestjs.com/) (Main Framwork)
- [MikroOrm](https://mikro-orm.io/)(mini Orm To Working With Postgres )
- [postgresql](https://www.postgresql.org/)(Main Database)
- [jwt](https://jwt.io/)(Autentication and Authorization By JsonWebToken)
- [swagger](https://swagger.io/)(Documentation APIs)
- [argon2](https://www.npmjs.com/package/argon2)(New Method for hashing Fast and safe)
- [redis](https://redis.io/)(Redis for working with cache)
- [decimaljs](https://www.npmjs.com/package/decimal.js/v/10.4.3) (decimal.js to have a high precision of numbers and to avoid [IEEE 754 floating point](https://en.wikipedia.org/wiki/Floating-point_arithmetic) pitfalls when working with monetary system)
- [nodemailer](https://www.nodemailer.com/)(Sending Email)

## 🔧 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Postgres
- npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/ErfanAbedinpour/TechnoAra.git
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:

```bash
npm run migration:run
```

5. Start the development server:

```bash
npm run dev
```

### using dokcer for run

1. Clone the repository:

```bash
git clone https://github.com/ErfanAbedinpour/TechnoAra.git
```

2. Run Database migrations:

```bash
docker compose up migration
```

3. Run Database Seeders:

```bash
docker compose up seed
```

4. Start

```bash
docker compose up
```

### Running Tests

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e
```

### Api Documentaion

- Swagger Docuement http://host:port/docs

## TODO

- [x] Login
- [x] Register
- [x] AccessToken and refreshToken
- [x] AuthGurad
- [x] RoleGurad
- [x] User Create,Read,Update,Delete => CRUD
- [x] Product
- [x] make code Pretty By SOLID principle
- [x] Attribute Module for Added to special Product and Remove them
- [ ] E2E test and unit test
- [ ] Cart Module
- [x] category CRUD
- [x] category Test
- [x] Brand CRUD
- [ ] Search product
- [ ] Delete account
- [ ] reset password
- [ ] article
- [ ] comment for product
- [ ] comment for article
- [ ] add blog or article to favirite
- [ ] dashborad
- [ ] User panel
- [ ] orders
- [ ] payment
- [ ] Pricing Module for calculation price of product
- [ ] Welcome Message By Send Email Notification

## EndPoints

### Authentication

#### Singup

```HTTP
POST http://localhost:3000/auth/singup
"Content-Type":"application/json"
```

#### Login

```HTTP
POST http://localhost:3000/auth/login
"Content-Type":"application/json"
```

#### GetAccessToken

```HTTP
POST http://localhost:3000/auth/token
"Content-Type":"application/json"
```

#### Logout

```HTTP
POST http://localhost:3000/auth/logout
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

### User(Admin Permission)

#### FindAll

```HTTP
GET http://localhost:3000/user?limit=?&page=?
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

#### FindOne

```HTTP
GET http://localhost:3000/user/:id
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

#### Update

```HTTP
PATCH http://localhost:3000/user/:id
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

#### Delete

```HTTP
DELETE http://localhost:3000/user/:id
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

### Product

#### Create

```HTTP
POST http://localhost:3000/product
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

#### FindAll

```HTTP
GET http://localhost:3000/product?limit=?&page=?
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

#### FindOne

```HTTP
GET http://localhost:3000/product/:id
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

#### Upate Or Added Attribute

```HTTP
PATCH http://localhost:3000/product/:id
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

#### Delete

```HTTP
DELETE http://localhost:3000/product/:id
"Content-Type":"application/json"
"Authorization": "Bearer ..."
```

## UI

### main Page:

- https://undefineduser1381.github.io/Technoara/

### user dashboard:

- https://undefineduser1381.github.io/Technoara/#/dashBoard/index

### admin panel

- https://undefineduser1381.github.io/Technoara/#/panel/dashboard
