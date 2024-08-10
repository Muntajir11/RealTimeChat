## Welcome to **ᑕOᑎᑎEᑕT 🪢**: A real-time messaging application designed for seamless and instant communication. This app is built using the MERN stack (MongoDB, Express, React, Node.js) and leverages Socket.IO for real-time chat functionality.


## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Real-time Messaging**: Chat instantly with your contacts with real-time message updates.
- **User Authentication**: Secure sign-up and login with JWT-based authentication.
- **Add Contacts**: Easily add contacts to your chat list.
- **Responsive Design**: Fully responsive layout, optimized for both desktop and mobile devices.
- **Search Functionality**: Quickly find and start conversations with your contacts.
- **Sidebar Navigation**: Manage your conversations and contacts from the intuitive sidebar.
- **Notifications**: Receive notifications for new messages.


## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Muntajir11/RealTimeChat.git
   ```
 
2. **Install dependencies:**
   In the project directory, run:
   ```bash
   npm install
   ```
   
3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following environment variables:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
   Replace `your_mongodb_connection_string` with your MongoDB connection string and `your_jwt_secret` with a secure secret for JWT.
   
5. **Start the development server:**
   Run the following command to start the server:
   ```bash
   npm run server // In the Root folder
   npm run dev    // In the Frontend folder
   ```
   
6. **Access the application:**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

You should now see the **ᑕOᑎᑎEᑕT 🪢** application running locally.



## Usage

Once the servers are running, open your browser and navigate to `http://localhost:3000` to start using the app.
- **Sign up**: Create a new account.
- **Login**: Use your credentials to log in.
- **Add Contacts**: Search for users and add them to your contact list.
- **Start Chatting**: Select a contact and start a conversation.


## Screenshots

### Login page  ->
![Login Page](https://github.com/user-attachments/assets/49b53cdd-7de8-42ec-9640-7d80afc18a41)

### SignUp Page ->
![SignUp Page](https://github.com/user-attachments/assets/365eeb7a-f135-45d2-909a-ecd3b20e2f40)

### Home Page ->
![Home Page](https://github.com/user-attachments/assets/f9eb97c6-32fa-496f-9ddf-5eec00326605)

### Chat Window ->
![Chat Window](https://github.com/user-attachments/assets/07ed415d-7734-4988-a385-754688c55a9c)


## Technologies Used

- **Frontend**: React, Zustand for state management, Tailwind CSS for styling
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT, bcrypt
- **Deployment**: (Specify if you've deployed it on platforms like Heroku, Netlify, etc.)

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
If you have any questions, suggestions, or feedback, feel free to reach out:

- **Muntajir**: [Email](mailto:Muntajirwork11@gmail.com)
- **GitHub**: [GitHub Profile](https://github.com/Muntajir11)
- **LinkedIn**: [LinkedIn Profile](https://www.linkedin.com/in/munta-jir-30737a230/)
