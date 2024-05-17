const express = require('express');
const cors = require('cors');
const app = express();
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

app.use(cors({
  origin: 'http://localhost:5173'
}));

const pool = new Pool({
  user: 'postgres',
  host: '172.23.0.3',
  database: 'redmine',
  password: 'password',
  port: 5432,
});

const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/data', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT * FROM projects');
    const data = result.rows;
    res.send(data);
  } catch (err) {
    console.error('Error fetching data', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.get('/project/:id', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const id = req.params.id;
    const result = await client.query(`SELECT * FROM projects WHERE id = $1`, [id]);
    const data = result.rows;
    res.send(data);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.get('/project/:id/members', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
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
    const { rows } = await client.query(query, [projectId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.post('/send-email', async (req, res) => {
  const { recipientEmail, projectName, projectMembers, projectId } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "raahuulchaudhary@gmail.com", // Replace with your email
      pass: "ancvbamtxblonzzh", // Replace with your password
    },
  });

  try {
    const uniqueLink = `http://localhost:5173/project/${projectId}`; // Create unique link with projectId
    const emailBody = `Dear Team Lead,\n\nYou have been assigned to review the project '${projectName}'.\n\nProject Members:\n`;
    const membersList = projectMembers && Array.isArray(projectMembers)
      ? projectMembers.map((member, index) => `${index + 1}. ${member.firstname} ${member.lastname}`).join('\n')
      : '';

    const emailContent = `${emailBody}${membersList}\n\nPlease provide your remarks for each member in the following format:\n1. Remarks for Member 1\n2. Remarks for Member 2\n...\n\nThank you.\n\nLink to project: ${uniqueLink}`; // Include uniqueLink in email content

    // Send email
    const info = await transporter.sendMail({
      from: '"Rahul Chaudhary" <YOUR_EMAIL>', // Replace with your email
      to: recipientEmail,
      subject: 'Project Review Assignment',
      text: emailContent,
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/store-remarks', async (req, res) => {
  try {
    res.send('Remarks stored successfully');
  } catch (error) {
    console.error('Error storing remarks:', error);
    res.status(500).json({ message: 'Failed to store remarks' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
});
