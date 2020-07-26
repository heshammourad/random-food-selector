/* eslint-disable no-console */
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const helmet = require('helmet');
const basicAuth = require('express-basic-auth');

const db = require('./db');

const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });
} else {
  const { PASSWORD, USERNAME } = process.env;

  const app = express();

  app.use(helmet());

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  const router = express.Router();

  router.use(basicAuth({
    users: {
      [USERNAME]: PASSWORD,
    },
  }));

  router.get('/login', async (req, res) => {
    res.status(200).send();
  });

  router.route('/types').get(async (req, res) => {
    try {
      const result = await db.select('SELECT * FROM type');
      if (!result) {
        res.status(404).send();
        return;
      }
      res.send(result.rows);
    } catch (err) {
      console.error(err.toString());
      res.status(500).send();
    }
  }).post(async ({ name }, res) => {
    try {
      if (!name) {
        res.status(400).send();
        return;
      }
      const result = await db.insert('type', [name], 'id');
      if (!result) {
        res.status(500).send();
        return;
      }
      res.send(result.rows);
    } catch (err) {
      console.error(err.toString());
      res.status(500).send();
    }
  });

  app.use('/api', router);

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
  });

  app.listen(PORT, () => {
    console.error(`Node ${isDev ? 'dev server' : `cluster worker ${process.pid}`}: listening on port ${PORT}`);
  });
}
