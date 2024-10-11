import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    api: process.env.API_KEY
};

export default config;