import express from 'express';

export function createConnectionsRouter(connectionController) {
  const router = express.Router();
  router.get('/connected', connectionController.getConnected);
  return router;
}