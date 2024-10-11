import express from 'express';
import {getConvert, getCurrencyList} from "../controllers/currencyController.js";

const router = express.Router();

router.post('/convert', getConvert);
router.get('/', getCurrencyList);

export default router;