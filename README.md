# Simply Chat App

This is a simple chat application built using Node.js, Express, MongoDB (Mongoose), Socket.io, AWS S3, Nodemailer, HTML, CSS, bcrypt, JWT, and Moment.js.

## Features

- **Real-time Chat:** Utilizes Socket.io for real-time communication between users.
- **User Authentication:** Implements bcrypt for password hashing and JWT for user authentication.
- **File Uploads:** Enables users to upload and share files in chat rooms, using AWS S3 for storage.
- **Email Notifications:** Sends email notifications to users for new messages, using Nodemailer.
- **Responsive Design:** Provides a responsive design using HTML and CSS for a seamless user experience across devices.
- **Timestamp Formatting:** Uses Moment.js to format timestamps for messages and notifications.

## Technologies Used

- Backend: Node.js, Express.js, nodemailer.

* Frontend: HTML, CSS, Bootstrap, JavaScript (EJS for templating), Momentjs.

- Storage: MongoDB, S3.

## Installation

### 1. Clone the repository:

`git clone https://github.com/your-username/simply-chat-app.git`

### 2.Install dependencies:

`cd simply-chat-app`

`npm install`

### 3. Create a .env file in the root directory with the following variables:

PORT=3000

MONGODB_USERNAME=your_mongoDB_username

MONGODB_PASSWORD=your_mongoDb_password

AWS_BUCKET_NAME=your_s3_bucket_name

AWS_ACCESS_KEY_ID=your_aws_access_key_id

AWS_ACCESS_KEY_SECRET=your_aws_secret_access_key

REGION=your_AWS_Region

EMAIL=mailId_from_which_your_email_will_be_sent

PASSWORD=API_PASSKEY_of_that_mailId

### 4. Start the server:

`npm start`

## Usage:

- Register a new account or login with an existing account.
- Start chatting with other users in real-time.
- Upload files to share with other users.
