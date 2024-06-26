const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3001;
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.',
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.use('/api/', apiLimiter);
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({
  origin: "http://rahul-ahlawat.io:5173",
  credentials: true
}));

const pool = new Pool({
  user: "postgres",
  host: "172.19.0.3",
  database: "redmine",
  password: "password",
  port: 5432,
  connectionTimeoutMillis: 5000,
});


// Set up session store
const memoryStore = new session.MemoryStore();
app.use(session({
  secret: "@@@###1222###@@@",
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const keycloakConfig = {
  clientId: 'performclient',
  bearerOnly: true,
  serverUrl: 'http://localhost:8080',
  realm: 'performance',
  // realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsvaU3ellnpq64DbyuV+iu15oy29DkgWmuCaea2Oy0o7pYk/7lswjHoNcMajzAYHkUY0F34kzohWa9aj6Iso5JhZlztOybFuPl367Nd9ZxiBgabij/w7nI/jXCQzcWfzE0zI0j2Y2BIos7XNrhGE5KXjETXd5DyoBx3nh808d5RNiyq92Tg2Y4cMobOFiE1rRip68sukRPObIYGq3NfPNVLOrEaFVIC10KC6VS+EpkP/Mm0UngPgNdcdJtVfXi2wt7+orFNZapa8CXGfQfIaw2CTmCptPVmywotcRUN2wcrffWjuLeDeNEFQ3eBZno867YVSPAocnNPuU1Zn0Vst0BQIDAQAB'
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
app.use(keycloak.middleware());

app.use(express.json());
app.use(morgan('dev'));
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
    from: "raahuulchaudhary@gmail.com",
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


app.get('/api/data',   async (req, res) => {
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

app.get('/api/projects_with_remarks', async (req, res) => {
  try {
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-based index
    const currentYear = currentDate.getFullYear();

    // Query to fetch remarks for current month and year
    const query = `
      SELECT * 
      FROM project_remarks 
      WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2
    `;
    const result = await pool.query(query, [currentMonth, currentYear]);
    const data = result.rows;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching project remarks:', error);
    res.status(500).json({ message: 'Internal server error' });
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




app.post('/project/:id/remarks', async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    const { id: projectId } = req.params;
    const { remarks, selectedMember, uniqueId } = req.body; 

    // Check if remarks field is present and not empty
    if (!remarks || Object.keys(remarks).length === 0) {
      return res.status(400).json({ message: 'Remarks field is required and cannot be empty' });
    }

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
        'INSERT INTO project_remarks (date, month, year, project_id, project_name, tl_email, member_name, member_email, remark_1, remark_2, remark_3, remark_4, remark_5) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)',
        [
          date,               // $1: date
          monthName,          // $2: month
          year,               // $3: year
          projectId,          // $4: project_id
          projectName,        // $5: project_name
          selectedMember,            // $6: tl_email
          memberDetail.name,  // $7: member_name
          memberDetail.email, // $8: member_email
          memberRemarks[0] || null, // $9: remark_1
          memberRemarks[1] || null, // $10: remark_2
          memberRemarks[2] || null, // $11: remark_3
          memberRemarks[3] || null, // $12: remark_4
          memberRemarks[4] || null  // $13: remark_5
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




// app.use((err, req, res) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});


app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});
