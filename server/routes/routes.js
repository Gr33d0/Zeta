import express from 'express';
import {executePythonCode} from '../controller/interpreterController.js';
import { getDataUser, updateDataUser } from "../controller/dataUserController.js";
const router = express.Router();

router.post("/run", executePythonCode);
router.get("/getDataUser/:id", getDataUser);
router.patch("/updateDataUser/:id", updateDataUser);


export default router;