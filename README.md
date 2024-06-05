<!-- @format -->

<h2 align="center"> Edaga Delivery Application </h2>

<p align="center">
  <img src="https://res.cloudinary.com/drnarknab/image/upload/v1717537760/Screenshot_218_fgh2ew.png" />
</p>

# Project Description

Edaga is a food and goods delivery application developed to be implemented in Eritrea.

# Live Link

Deployed application :<br>
https://edaga-delivery.web.app/

# Used Technologies

The following technologies have been used in the building process of the Student Hub application:

- React (v18.2.0)
- Firebase (v10.7.1)
- Node JS (v18.16.0)
- HTML
- CSS
- Node mailer
- Material UI
- Vite (v4.4.5)

**Vite:** a build tool is used because of it allows for fast development and build times.
**Firebase:** a platform for building web and mobile applications that provides backend services such as authentication, database, and storage.

# Project Setup

## First Step

First to run the project, download a zip file from the GitHub repository which contain all of the web application files
![GitHubStep1](https://res.cloudinary.com/drnarknab/image/upload/v1717538582/Screenshot_219_xftdvw.png)

After the zip file is downloaded the project need to be unzipped to any location on disk drive. After this the correct version of Nodejs need to be installed ["NodeJS"](https://nodejs.org/en/download/) on the computer if it doesn't installed before.

## Second Step

Next the folder containing the project file need to be opened on VSCODE editor. After loading successfully to Visual Studio all dependencies that are located in package.json file should be installed.

In the root directory of the project run the following command in the terminal :

```javascript
npm install
```

![Step2](https://res.cloudinary.com/drnarknab/image/upload/v1707920066/resource/Screenshot_135_y3clas.png)

## Third Step

### .env variables

Next step is to create .env file in the root directory of the project. It's containing the project firebase configuration variables.

```javascript
VITE_ADMIN=JdP7xcdJgZXTZnNXsZy8DflBqAv1
VITE_RIDER=6BpfmiDB6dR35ieb5BG3guumHRI3
```

Next, copy and paste the above firebase configuration variables to the .env file.

# Development mode (Localhost)

After downloading project and installing all dependecies, and creatig .env file with Firebase configuration provided above, the project can be run(started) with the following command by typing it on the terminal.

```javascript
npm run dev
```

![Development mode](https://res.cloudinary.com/drnarknab/image/upload/v1707921818/resource/Screenshot_137_qwdtn1.png)
![Development mode](https://res.cloudinary.com/drnarknab/image/upload/v1707921820/resource/Screenshot_138_x9jdnw.png)

You can login using either Facebook or Google account or register for new account.

** Test email & **Test password
admin account
admin@gmail.com 003879
rider account
rider1@gmail.com 003879
