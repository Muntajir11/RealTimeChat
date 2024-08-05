import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find the logged-in user and populate their contacts
        const loggedInUser = await User.findById(loggedInUserId).populate("contacts", "-password");

        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const userContacts = loggedInUser.contacts;

        res.status(200).json(userContacts);
    } catch (error) {
        console.log("Error in getUsersForSidebar function: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




export const addContact = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const userToAdd = await User.findOne({ username: new RegExp('^' + username + '$', 'i') });
        if (!userToAdd) {
            return res.status(404).json({ error: "User not found" });
        }

        const loggedInUser = await User.findById(req.user._id);
        if (!loggedInUser) {
            return res.status(404).json({ error: "Logged-in user not found" });
        }

        // Check if the username is the same as the logged-in user's username
        if (userToAdd._id.equals(loggedInUser._id)) {
            return res.status(400).json({ error: "You cannot add yourself as a contact" });
        }

        // Check if the contact is already in the logged-in user's contacts
        if (loggedInUser.contacts.includes(userToAdd._id)) {
            return res.status(400).json({ error: "User is already a contact" });
        }

        // Check if the logged-in user is already in the contact's contacts
        if (userToAdd.contacts.includes(loggedInUser._id)) {
            return res.status(400).json({ error: "User is already a contact" });
        }

        // Add the user to the logged-in user's contacts
        loggedInUser.contacts.push(userToAdd._id);
        await loggedInUser.save();

        // Add the logged-in user to the contact's contacts
        userToAdd.contacts.push(loggedInUser._id);
        await userToAdd.save();

        res.status(200).json({ message: "Contact added successfully. Refresh!" });
    } catch (error) {
        console.error("Error in addContact function:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};