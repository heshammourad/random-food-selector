/* eslint-disable no-console */
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const path = require('path');

const express = require('express');
const basicAuth = require('express-basic-auth');
const helmet = require('helmet');

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
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`,
    );
  });
} else {
  const { PASSWORD, USERNAME } = process.env;

  const app = express();

  app.use(helmet());

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, '../react-ui/build')));

  const router = express.Router();

  router.use(
    basicAuth({
      users: {
        [USERNAME]: PASSWORD,
      },
    }),
  );

  router.use(express.json());

  router.get('/login', async (req, res) => {
    res.status(200).send();
  });

  router
    .route('/types/:typeId')
    .get(async ({ params: { typeId } }, res) => {
      try {
        const typeResult = await db.select(
          'SELECT name FROM type WHERE id = $1',
          [typeId],
        );
        if (!typeResult.rowCount) {
          res.status(404).send();
          return;
        }
        const itemsResult = await db.select('SELECT * FROM item');
        res.send({ name: typeResult.rows[0].name, items: itemsResult.rows });
      } catch (err) {
        console.error(err.toString());
        res.status(500).send();
      }
    })
    .post(async ({ body: { name }, params: { typeId } }, res) => {
      try {
        if (!name) {
          console.error('Missing name in request body');
          res.status(400).send();
          return;
        }
        const result = await db.insert(
          'item',
          { name, type_id: typeId, last_used_date: new Date() },
          'id',
        );
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

  router
    .route('/types')
    .get(async (req, res) => {
      try {
        const result = await db.select('SELECT * FROM type');
        res.send(result.rows);
      } catch (err) {
        console.error(err.toString());
        res.status(500).send();
      }
    })
    .post(async ({ body: { name } }, res) => {
      try {
        if (!name) {
          console.error('Missing name in request body');
          res.status(400).send();
          return;
        }
        const result = await db.insert('type', { name }, 'id');
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
    response.sendFile(
      path.resolve(__dirname, '../react-ui/build', 'index.html'),
    );
  });

  app.listen(PORT, () => {
    console.error(
      `Node ${
        isDev ? 'dev server' : `cluster worker ${process.pid}`
      }: listening on port ${PORT}`,
    );
  });
}
