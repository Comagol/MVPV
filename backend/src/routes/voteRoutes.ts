import express from 'express';
import { VoteService } from '../services/VoteService';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = express.Router();
const voteService = new VoteService();
