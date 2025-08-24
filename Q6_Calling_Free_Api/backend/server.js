import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
const PORT = 3000;

app.use(express.static(path.join(__dirname,"../frontend")));

app.get('/api/holidays', async (req, res) => {
    const country = req.query.country || 'US';
    try {
        const response = await fetch(`https://date.nager.at/api/v3/NextPublicHolidays/${country}`);
        const data = await response.json();
        res.json(data.slice(0,5));
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch holiday data'});
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
