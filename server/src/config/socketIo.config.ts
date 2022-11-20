import dotenv from 'dotenv';
dotenv.config();

export const getWSconfig = () => ({
    cors: {
        origin: process.env.APP_URL,
        methods: ["GET", "POST"]
      }
})