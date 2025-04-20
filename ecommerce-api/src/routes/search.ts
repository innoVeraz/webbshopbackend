import express from 'express';
import { searchGoogle } from '../controllers/searchController';

const router = express.Router();

router.get('/', searchGoogle);

export default router;