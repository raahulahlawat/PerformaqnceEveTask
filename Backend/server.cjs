const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

app.use('/api/', apiLimiter);
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Set up session store
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

// Initialize Keycloak
const keycloakConfig = require('./keycloak.json');
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
app.use(keycloak.middleware());

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const emailLinks = {};

async function sendEmail(recipientEmail, subject, text) {
  let mailOptions = {
    from: process.env.EMAIL_FROM,
    to: recipientEmail,
    subject: subject,
    text: text
  };

  let info = await transporter.sendMail(mailOptions);
  console.log('Email sent:', info.response);
}

app.post('/send-email', async (req, res) => {
  try {
    const { recipientEmail, subject, text } = req.body;

    const urlParams = new URLSearchParams(text.split('http://rahul-ahlawat.io:5173')[1]);
    const uniqueId = urlParams.get('id');
    const expires = urlParams.get('expires');
    emailLinks[uniqueId] = expires;

    await sendEmail(recipientEmail, subject, text);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
});


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

    if (!id || isNaN(id)) {
      console.log('Invalid project ID');
      res.status(400).send('Invalid project ID');
      return;
    }

    console.log(`Fetching project with ID: ${id}`);
    const result = await client.query('SELECT * FROM projects WHERE id = $1', [parseInt(id, 10)]);
    const data = result.rows[0];

    if (data) {
      console.log('Fetched data:', data);
      res.json(data);
    } else {
      console.log('No data found for the given ID');
      res.status(404).send('No data found');
    }
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

    if (!projectId || isNaN(projectId)) {
      res.status(400).send('Invalid project ID');
      return;
    }

    const membersQuery = `
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
    const { rows: projectMembers } = await client.query(membersQuery, [parseInt(projectId, 10)]);

    const tlQuery = `
      SELECT 
        u.id AS user_id,
        u.firstname,
        u.lastname
      FROM 
        groups_users gu
      INNER JOIN 
        users u 
      ON 
        gu.user_id = u.id 
      WHERE 
        gu.group_id = $1
    `;
    const { rows: teamLeads } = await client.query(tlQuery, [parseInt(projectId, 10)]);

    res.json({ projectMembers, teamLeads });
  } catch (error) {
    console.error('Error fetching project members:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.get('/project/:id/tls', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const projectId = req.params.id;

    if (!projectId || isNaN(projectId)) {
      res.status(400).send('Invalid project ID');
      return;
    }

    const query = `
      WITH group_projects AS (
        SELECT
            gu.group_id AS group_id,
            u.id AS tl_id,
            u.lastname AS groupname,
            array_agg(u2.login) AS group_members,
            p.id AS project_id,
            p.name AS projectname
        FROM
            groups_users gu
        JOIN
            users u ON gu.group_id = u.id
        JOIN
            users u2 ON gu.user_id = u2.id
        JOIN
            members m ON gu.user_id = m.user_id
        JOIN
            projects p ON m.project_id = p.id
        WHERE
            u.lastname LIKE '%-TL'
            AND m.project_id = $1
        GROUP BY
            gu.group_id, u.id, u.lastname, p.id, p.name
      )
      SELECT
          gp.project_id,
          gp.projectname AS project_name,
          gp.group_id,
          gp.tl_id,
          gp.groupname AS tl_name,
          gp.group_members AS group_members,
          array_agg(DISTINCT u.login) AS all_project_members
      FROM
          group_projects gp
      JOIN
          members m ON gp.project_id = m.project_id
      JOIN
          users u ON m.user_id = u.id
      GROUP BY
          gp.project_id, gp.projectname, gp.group_id, gp.tl_id, gp.groupname, gp.group_members
      ORDER BY
          gp.projectname;
    `;

    const result = await client.query(query, [parseInt(projectId, 10)]);
    const data = result.rows;
    res.send(data);
  } catch (err) {
    console.error('Error fetching TL details', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

app.get('/project/:id/tls/:tl_id/members', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const projectId = req.params.id;
    const tlId = req.params.tl_id;

    if (!projectId || isNaN(projectId) || !tlId || isNaN(tlId)) {
      res.status(400).send('Invalid project or TL ID');
      return;
    }

    const query = `
      SELECT 
        u.id AS user_id,
        u.firstname,
        u.lastname,
        u.login
      FROM 
        groups_users gu
      INNER JOIN 
        users u 
      ON 
        gu.user_id = u.id 
      WHERE 
        gu.group_id = $1
    `;

    const { rows: tlMembers } = await client.query(query, [parseInt(tlId, 10)]);
    res.json({ tlMembers });
  } catch (error) {
    console.error('Error fetching TL members:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (client) {
      client.release();
    }
  }
});

const getProjectMembers = async (projectId) => {
  const membersQuery = `
    SELECT 
      m.id AS member_id, 
      u.firstname || ' ' || u.lastname AS member_name
    FROM 
      members m 
    INNER JOIN 
      users u 
    ON 
      m.user_id = u.id 
    WHERE 
      m.project_id = $1
  `;
  const { rows: projectMembers } = await pool.query(membersQuery, [parseInt(projectId, 10)]);
  const memberNames = {};
  projectMembers.forEach(row => {
    memberNames[row.member_id] = row.member_name;
  });
  return memberNames;
};

app.post('/project/:id/remarks', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { id: projectId } = req.params;
    const { remarks, selectedMember, uniqueId } = req.body; // Added uniqueId to the request body

    const date = new Date();
    const projectNameQuery = 'SELECT name FROM projects WHERE id = $1';
    const projectNameResult = await pool.query(projectNameQuery, [projectId]);
    const projectName = projectNameResult.rows[0]?.name;
    if (!projectName) {
      throw new Error('Project not found');
    }

    const memberDetailsQuery = `
      SELECT 
        m.id AS member_id, 
        u.firstname || ' ' || u.lastname AS member_name,
        u.login AS member_email
      FROM 
        members m 
      INNER JOIN 
        users u 
      ON 
        m.user_id = u.id 
      WHERE 
        m.project_id = $1
    `;
    const { rows: projectMembers } = await pool.query(memberDetailsQuery, [parseInt(projectId, 10)]);
    const memberDetails = {};
    projectMembers.forEach(row => {
      memberDetails[row.member_id] = { name: row.member_name, email: row.member_email };
    });

    // Transform remarks into the expected format
    const transformedRemarks = {};
    Object.entries(remarks).forEach(([key, value]) => {
      const [memberId, remarkIndex] = key.split('_');
      if (!transformedRemarks[memberId]) {
        transformedRemarks[memberId] = [];
      }
      transformedRemarks[memberId][remarkIndex] = value;
    });

    
    const monthName = new Intl.DateTimeFormat('en', { month: 'long' }).format(date);
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const year = date.getFullYear(); // Get the current year

    // Check if a remark already exists for this project and TL in the current month and year
    const existingRemarkQuery = `
      SELECT * FROM project_remarks 
      WHERE project_name = $1 AND tl_email = $2 AND month = $3 AND year = $4
    `;
    const existingRemarksResult = await pool.query(existingRemarkQuery, [projectName, selectedMember, monthName, year]);

    if (existingRemarksResult.rows.length > 0) {
      console.log('Existing remarks found:', existingRemarksResult.rows);
      return res.status(400).json({ message: 'Remarks for this project by this TL already exist for this month and year' });
    }

    const insertQueries = Object.entries(transformedRemarks).map(([memberId, memberRemarks]) => {
      const memberDetail = memberDetails[memberId];
      if (!memberDetail) {
        throw new Error(`Member details not found for member ID ${memberId}`);
      }
      return pool.query(
        'INSERT INTO project_remarks (date, project_name, project_id, member_name, member_email, tl_email, remark_1, remark_2, remark_3, remark_4, remark_5, month, year) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', 
        [
          date,
          projectName,
          projectId,
          memberDetail.name,
          memberDetail.email,
          selectedMember,
          memberRemarks[0] || null,
          memberRemarks[1] || null,
          memberRemarks[2] || null,
          memberRemarks[3] || null,
          memberRemarks[4] || null,
          monthName,
          year
        ]
      );
      
    });

    await Promise.all(insertQueries);
    delete emailLinks[uniqueId];

    res.status(200).json({ message: 'Remarks stored successfully' });
    console.log('Remarks Stored');
  } catch (error) {
    console.error('Error storing remarks:', error.message);
    res.status(500).json({ message: 'Failed to store remarks. Please try again later.' });
  } finally {
    if (client) {
      client.release();
    }
  }
});



app.delete('/api/projects/:id/remarks', async (req, res) => {
  const { id } = req.params;
  const { month, year } = req.query;

  try {
    const remarksExist = await pool.query('SELECT * FROM project_remarks WHERE project_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3', [id, month, year]);
    if (remarksExist.rows.length === 0) {
      return res.status(404).json({ message: 'No remarks found for the selected month and year.' });
    }
    await pool.query('DELETE FROM project_remarks WHERE project_id = $1 AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3', [id, month, year]);
    res.status(200).json({ message: 'Remarks deleted successfully' });
  } catch (error) {
    console.error('Error deleting remarks:', error);
    res.status(500).json({ message: 'Failed to delete remarks' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});