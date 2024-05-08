const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');

const pool = new Pool({
  user: 'postgres',
  host: '172.23.0.4',
  database: 'redmine',
  password: 'password',
  port: 5432, // Default PostgreSQL port
});

const port = process.env.PORT || 3001; // Use the specified port or default to 3001

app.use(cors({
  origin: 'http://localhost:5174'
}));

app.get('/api/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM projects');
    const data = result.rows;
    // console.log(data)
    res.send(data);
    client.release();
    
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});