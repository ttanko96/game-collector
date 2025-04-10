import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
console.log('Server starting...');
console.log('Environment variables:', {
  IGDB_CLIENT_ID: process.env.IGDB_CLIENT_ID ? '***' : 'MISSING',
  IGDB_CLIENT_SECRET: process.env.IGDB_ACCESS_TOKEN ? '***' : 'MISSING',
  PORT: process.env.PORT || 'NOT SET'
});

const igdbBaseUrl = 'https://api.igdb.com/v4';

async function getTwitchToken() {
  const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
    params: {
      client_id: process.env.IGDB_CLIENT_ID,
      client_secret: process.env.IGDB_ACCESS_TOKEN,
      grant_type: 'client_credentials'
    }
  });
  return response.data.access_token;
}

let cachedToken = null;
let tokenExpiration = null;

async function getAuthHeaders() {
  if (!cachedToken || Date.now() >= tokenExpiration) {
    cachedToken = await getTwitchToken();
    tokenExpiration = Date.now() + 5587808 * 1000; // 64 days
  }
  return {
    'Client-ID': process.env.IGDB_CLIENT_ID,
    'Authorization': `Bearer ${cachedToken}`,
    'Accept': 'application/json'
  };
}

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.get('/api/games', async (req, res) => {
  console.log('Received request to /api/games');
  try {
    const { search } = req.query;
    console.log('Search term:', search);

    if (!search || search.length < 1) {
      console.log('Invalid search term');
      return res.status(400).json({ error: 'At least one letter required!' });
    }

    console.log('Getting auth headers...');
    const headers = await getAuthHeaders();
    console.log('Headers obtained');

    console.log('Making IGDB API request...');
    const response = await axios.post(`${igdbBaseUrl}/games`, 
      `fields name,first_release_date,cover.image_id,rating,summary,platforms.name,total_rating;
       search "${search}";
       limit 40;`,
      {
        headers: headers
      }
    );

    console.log('IGDB API response received');

    if (!response.data) {
      throw new Error('Invalid API response structure.');
    }

    const results = response.data.map(game => ({
      id: game.id,
      name: game.name,
      release: game.first_release_date ? 
        new Date(game.first_release_date * 1000).toISOString().split('T')[0] : 
        'Unknown',
      cover: game.cover ? 
        `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg` : 
        null,
      rating: game.rating ? Math.round(game.rating) : 0,
      description: game.summary || 'No description available',
      platforms: game.platforms?.map(p => p.name),
      metacritic: game.total_rating ? Math.round(game.total_rating) : 0
    }));

    res.json(results);

  } catch (error) {
    console.error('API error details: ', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });

    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;

    res.status(status).json({
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

app.get('/', (req, res) => {
  console.log('Health check received');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running: http://localhost:${process.env.PORT}`);
  console.log('Available endpoints:');
  console.log(`- GET /api/games`);
  console.log(`- GET /api/test`);
});