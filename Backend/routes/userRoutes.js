import express from 'express';
import protectRoute from '../middleware/protectRoute.js';
import { getUsersForSidebar } from '../controllers/userController.js';
import { addContact } from '../controllers/userController.js';


const router=express.Router();

router.get("/",protectRoute,getUsersForSidebar);
router.post("/add-contact", protectRoute, addContact);

export default router;