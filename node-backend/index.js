const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');
const multiparty = require('connect-multiparty')

const app = express();

// bodyParser
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));

// cors
const corsopt = {
    origin: '*',
    optionsSuccessStatus: 200,
}
app.use(cors(corsopt));

// postgresql
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '123',
  port: 5432,
});


// APP

app.post('/api/login', cors(), async (req, res) => {
  try {
    const { mail, password } = req.body;

    // Query the database to check if the user exists with the provided credentials
    const query = 'SELECT * FROM gh_users WHERE mail = $1 AND password = $2';
    const values = [mail, password];

    const result = await pool.query(query, values);

    if (result.rows.length === 1) {
      // User found, login successful
      const { username } = result.rows[0];
      const { mail } = result.rows[0];
      res.status(200).json({ message: 'Login successful', username, mail });
    } else {
      // No user found or invalid credentials
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.post('/api/register', cors(), async (req, res) => {
  try {
    const { username, mail, password } = req.body;

    const query = 'INSERT INTO gh_users (username, mail, password) VALUES ($1, $2, $3)';
    const values = [username, mail, password];

    await pool.query(query, values);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.get('/api/information', async (req, res) => {
  try {
    const { username } = req.query;

    const query = 'SELECT * FROM gh_users WHERE username = $1';
    const values = [username];

    console.log('Query:', query, 'Values:', values); // Log query and values

    const result = await pool.query(query, values);

    console.log('Result:', result.rows); // Log the query result

    if (result.rows.length === 1) {
      res.status(200).json(result.rows[0]); // Assuming you want to send user info as JSON
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ message: 'Error fetching user information' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const query = 'SELECT * FROM gh_logs ORDER BY datetime DESC LIMIT 20';
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching history information:', error);
    res.status(500).json({ message: 'Error fetching history information' });
  }
});

app.delete('/api/history/:id', async (req, res) => {
  try {
    const itemId = req.params.id;

    const query = 'DELETE FROM gh_logs WHERE id = $1';
    const values = [itemId];

    await pool.query(query, values);
    res.status(200).json({ message: 'History item deleted successfully' });
  } catch (error) {
    console.error('Error deleting history item:', error);
    res.status(500).json({ message: 'Error deleting history item' });
  }
});

app.post('/api/history-add', cors(), async (req, res) => {
  try {
    const { datetime, username, success, repositories } = req.body;

    const query = 'INSERT INTO gh_logs (datetime, username, success, repositories) VALUES ($1, $2, $3, $4)';
    const values = [datetime, username, success, repositories];

    await pool.query(query, values);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.put('/api/edit', async (req, res) => {
  try {
    const { username, mail, newPassword } = req.body;

    // Update user information in the database
    const query = 'UPDATE gh_users SET mail = $1, password = $2 WHERE username = $3';
    const values = [mail, newPassword, username];

    await pool.query(query, values);
    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ message: 'Error updating user information' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
