
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

export const getPrediction = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const aiUrl = process.env.AI_SERVICE_URL;
        const response = await axios.get(`${aiUrl}/predict`);
        res.status(200).json(response.data);
    } catch (error) { next(error); }
};

export const chatTika = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const aiUrl = process.env.AI_SERVICE_URL;
        const { message, user_name } = req.body;
        const response = await axios.post(`${aiUrl}/chat`, { message, user_name });
        res.status(200).json(response.data);
    } catch (error) { next(error); }
};
