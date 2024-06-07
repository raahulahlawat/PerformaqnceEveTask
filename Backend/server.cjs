const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3001;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://rahul-ahlawat.io:5173',
  credentials: true
}));

const pool = new Pool({
  user: 'postgres',
  host: '172.23.0.2',
  database: 'redmine',
  password: 'password',
  port: 5432,
});

// Set up session store
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: 'vvvJdhrIUQgP19qALcc0hzQUcZZIJhNH',
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
    user: "raahuulchaudhary@gmail.com",
    pass: "falvizqrydjjhyix",
  },
});

const emailLinks = {};

async function sendEmail(recipientEmail, subject, text) {
  let mailOptions = {
    from: 'raahuulchaudhary@gmail.com',
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

app.get('/tl/:id', (req, res) => {
  const { id: uniqueId } = req.query;
  const expirationTime = emailLinks[uniqueId];

  if (!expirationTime || new Date(expirationTime) < new Date()) {
    return res.status(410).send('This link has expired.');
  }

  res.send('Project details and remark form');
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
    const { remarks, selectedMember } = req.body;

    const date = new Date();
    const projectNameQuery = 'SELECT name FROM projects WHERE id = $1';
    const projectNameResult = await pool.query(projectNameQuery, [projectId]);
    const projectName = projectNameResult.rows[0].name;

    // Fetch member names and emails dynamically
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

    const insertQueries = Object.entries(transformedRemarks).map(([memberId, memberRemarks]) => {
      const memberDetail = memberDetails[memberId];
      return pool.query(
        'INSERT INTO project_remarks (date, project_name, member_name, member_email, tl_email, remark_1, remark_2, remark_3, remark_4, remark_5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', 
        [
          date,
          projectName,
          memberDetail.name,
          memberDetail.email,
          selectedMember,
          memberRemarks[0] || null,
          memberRemarks[1] || null,
          memberRemarks[2] || null,
          memberRemarks[3] || null,
          memberRemarks[4] || null,
        ]
      );
    });

    // Execute all insert queries
    await Promise.all(insertQueries);

    res.status(200).json({ message: 'Remarks stored successfully' });
    console.log('Remarks Stored');
  } catch (error) {
    console.error('Error storing remarks:', error);
    res.status(500).json({ message: 'Failed to store remarks' });
  } finally {
    if (client) {
      client.release();
    }
  }
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});