import User from "../models/user.model.js";
import Contact from "../models/contacts.model.js"; // Import the Contact model

export const getConversations = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find the logged-in user's contact list
        const userContacts = await Contact.findOne({ user: loggedInUserId }).populate("contacts", "-password");

        if (!userContacts) {
            return res.status(200).json([]); // If no contacts found, return an empty array
        }

        const filteredUsers = userContacts.contacts;

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
