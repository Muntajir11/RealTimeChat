# ᑕOᑎᑎEᑕT 🪢

Welcome to **ᑕOᑎᑎEᑕT 🪢** - A real-time messaging application designed for seamless and instant communication. Built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.IO for real-time chat functionality, **ᑕOᑎᑎEᑕT 🪢** ensures your conversations are swift and secure.

 
## 🚀 **Features**

- 💬 **Real-time Messaging**: Chat instantly with your contacts, with real-time updates.
- 🔒 **User Authentication**: Secure sign-up and login using JWT-based authentication.
- 📝 **Add Contacts**: Effortlessly add contacts to your chat list.
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices.
- 🔍 **Search Functionality**: Quickly find and start conversations with your contacts.
- 📂 **Sidebar Navigation**: Manage your conversations and contacts from the intuitive sidebar.
- 🔔 **Notifications**: Receive notifications for new messages.

---

## 🛠️ **Installation**

Get a local copy of CONNECT up and running with these simple steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Muntajir11/RealTimeChat.git
   cd CONNECT
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add the following:
   ```bash
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. **Start the development server**:
   ```bash
   npm run server   # In the Root folder
   npm run dev      # In the Frontend folder
   ```

5. **Access the application**:
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

You should now see the **ᑕOᑎᑎEᑕT 🪢** application running locally.

---


### 📁 **Project Structure**

```
CONNECT
├── 🗂️ Backend
│   ├── 📂 controllers       # Handles the logic for various routes
│   ├── 📂 db                # Database configuration and models
│   ├── 📂 middleware        # Custom middleware functions
│   ├── 📂 models            # Mongoose schemas and models
│   ├── 📂 routes            # API route definitions
│   ├── 📂 socket            # Socket.IO configuration and events
│   ├── 📂 utils             # Utility functions
│   └── 📄 server.js         # Entry point for the Node.js server
│
├── 🗂️ Frontend
│   ├── 📂 public            # Static assets (images, icons, etc.)
│   ├── 📂 src               # Main source directory for the React app
│   │   ├── 🖼️ assets        # Images, fonts, and other assets
│   │   ├── 🧩 components    # Reusable React components
│   │   ├── 🌐 context       # React Context API for state management
│   │   ├── ⚙️ hooks         # Custom hooks for React
│   │   ├── 📄 pages         # Page components for routing
│   │   ├── 🛠️ utils        # Utility functions for frontend
│   │   └── 📦 zustand       # Zustand store for global state management
│   ├── 🎨 App.css           # Global styles for the React app
│   ├── ⚛️ App.jsx          # Main application component
│   ├── 🎨 index.css         # Global CSS file
│   └── ⚛️ main.jsx         # Entry point for the React application
│
├── 📄 .eslintrc.cjs         # ESLint configuration
├── 📄 .gitignore            # Git ignore file
├── 📄 index.html            # Main HTML file for the React app
├── 📄 package.json          # Dependencies and scripts for the frontend
├── 📄 package-lock.json     # Locked versions of dependencies
└── 📄 README.md             # Project documentation

 ```
### 📝 **Explanation**

- **Backend**: 🗂️ Contains all server-side code including controllers, database configurations, middleware, models, routes, socket configuration, and utilities.
- **Frontend**: 🗂️ Contains the front-end code organized into assets, components, context, hooks, pages, utilities, and Zustand store.
- **Root Files**:
  - `.eslintrc.cjs`: 📝 ESLint configuration for consistent code quality.
  - `.gitignore`: 📄 Specifies files and directories to be ignored by Git.
  - `index.html`: 📄 The HTML template for the React app.
  - `package.json` & `package-lock.json`: 📦 Manage project dependencies and scripts.


## 🎮 **Usage**

Once everything is set up:
- **Sign up**: Create a new account.
- **Login**: Use your credentials to log in.
- **Add Contacts**: Search for users and add them to your contact list.
- **Start Chatting**: Select a contact and begin a conversation.

---

## 🖼️ **Screenshots**

**Login Page**  
![Login Page](https://github.com/user-attachments/assets/49b53cdd-7de8-42ec-9640-7d80afc18a41)

**SignUp Page**  
![SignUp Page](https://github.com/user-attachments/assets/365eeb7a-f135-45d2-909a-ecd3b20e2f40)

**Home Page**  
![Home Page](https://github.com/user-attachments/assets/f9eb97c6-32fa-496f-9ddf-5eec00326605)

**Chat Window**  
![Chat Window](https://github.com/user-attachments/assets/07ed415d-7734-4988-a385-754688c55a9c)

---

## 🛠️ **Technologies Used**

- **Frontend**: React, Zustand, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Real-time Communication**: Socket.IO
- **Authentication**: JWT, bcrypt
- **Deployment**: Render

---

## 🤝 **Contributing**

Contributions are more than welcome! If you have ideas, improvements, or new features you'd like to add:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

Please ensure that your code is well-documented and tested.

---

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📬 **Contact**

Have questions, suggestions, or feedback? Feel free to reach out to the co-creators:
----
- **Muntajir**: [Muntajirwork11@gmail.com](mailto:Muntajirwork11@gmail.com)
- **GitHub**: [Muntajir11](https://github.com/Muntajir11)
- **LinkedIn**: [Muntajir](https://www.linkedin.com/in/munta-jir-30737a230/)
----
- **Tushar**: [Tushar.Manna@outlook.com](mailto:Tushar.Manna@outlook.com)
- **GitHub**: [Tushar-Manna](https://github.com/Tushar-Manna)
- **LinkedIn**: [tusharmanna](https://www.linkedin.com/in/tusharmanna/)
----
Thank you for using **ᑕOᑎᑎEᑕT 🪢**! 🌟
