import express from "express";
import cors from "cors";

import currencyRoutes from "./routes/currencyRoutes.js";
import config from "./config/config.js";

const app = express();

app.use(cors())
app.use(express.json());

app.use('/api/currency', currencyRoutes);

const PORT = config.port;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
