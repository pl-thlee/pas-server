/**
 * @see https://github.com/websockets/ws
 */
const WebSocket = require('ws');
const WebSocketJSONStream = require('websocket-json-stream');
const backend = require('./sharedb-server');
const uuid = require('uuid');

module.exports = (server) => {
  /**
   * @see https://github.com/websockets/ws/blob/master/doc/ws.md#new-websocketserveroptions-callback
   */
  const ws = new WebSocket.Server({
    noServer: true,
  });

  /** @see https://github.com/websockets/ws#simple-server */
  ws.on('connection', (ws, req) => {
    // generate an id for the socket
    ws.id = uuid();
    ws.isAlive = true;

    const stream = new WebSocketJSONStream(ws);
    backend.listen(stream);

    /**
     * @see https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
     */
    ws.on('pong', (data) => {
      ws.isAlive = true;
    });

    ws.on('error', (errorCode) => {
      console.error(errorCode);
    });
  });

  // Sockets Ping, Keep Alive
  const interval = setInterval((ping) => {
    ws.clients.forEach((ws) => {
      if (!ws.isAlive) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, 30000);

  ws.on('close', () => {
    clearInterval(interval);
  });

  return ws;
};
