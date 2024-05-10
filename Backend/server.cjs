const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');

const pool = new Pool({
  user: 'postgres',
  host: '172.23.0.2',
  database: 'redmine',
  password: 'password',
  port: 5432, 
});

const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.get('/api/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM projects');
    const data = result.rows;
    res.send(data);
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/project/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM projects WHERE id = $1`, [id]);
    const data = result.rows;
    res.send(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/project/:id/members', async (req, res) => {
  try {
    const projectId = req.params.id;
    const query = `
      SELECT 
        m.*, 
        u.firstname, 
        u.lastname 
      FROM 
        members m 
      INNER JOIN 
        users u 
      ON 
        m.user_id = u.id 
      WHERE 
        m.project_id = $1
    `;
    const { rows } = await pool.query(query, [projectId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
