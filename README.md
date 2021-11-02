# prisma-electron-test

A small reproduction to test using Prisma, Sqlite and Electron. This example uses electron builder to package the application. 



## Installation

-  Install dependencies: `npm install`
-  Create sqlite database and generate prisma client: `npx prisma db push`
-  To test locally: `npm run start`
-  To package for windows and linux: `npm run dist` 



### Note about migrations
In this example, we generate the sqlite files and database tables in development, package them into the production application and then copy the database file over to [user's application data directory](https://www.electronjs.org/docs/latest/api/app#appgetpathname).

To support migrations and schema changes in a deployed application, this would not be ideal. Two possible options

- Ship the prisma CLI along with the application 
- Create tables and migrations with `queryRaw` 

