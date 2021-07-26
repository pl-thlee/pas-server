const WebSocket = require('ws');
const _ = require('lodash');
const uuid = require('uuid');

module.exports = (server) => {
  const notifyConnections = (sourceId) => {
    connections.forEach((connection) => {
      sessions[connection.id].send(
        JSON.stringify({
          id: connection.id,
          sourceId: sourceId,
          connections: connections,
        })
      );
    });
  }

  const sessions = {};
  const connections = [];

  const wss = new WebSocket.Server({
    noServer: true,
  });

  wss.on('connection', (ws) => {
    // generate an id for the socket
    ws.id = uuid();
    ws.isAlive = true;

    ws.on('message', (message) => {
      let connectionIndex;

      message = JSON.parse(message);

      // If a connection id isn't still set
      // we keep sending id along with an empty connections array
      if (!message.id) {
        ws.send(
          JSON.stringify({
            id: ws.id,
            sourceId: ws.id,
            connections: [],
          })
        );
        return;
      } else {
        // If session/connection isn't registered yet, register it
        if (!sessions[ws.id]) {
          // Override/refresh connection id
          message.id = ws.id;

          // Push/add connection to connections hashtable
          connections.push(message);

          // Push/add session to sessions hashtable
          sessions[message.id] = ws;
        } else {
          // If this connection can't be found, ignore
          if (
            !~(connectionIndex = _.findIndex(connections, {
              id: message.id,
            }))
          ) {
            return;
          }

          // Update connection data
          connections[connectionIndex] = message;
        }

        // Notify all sessions
        notifyConnections(message.id);
      }
    });

    ws.on('close', function (code, reason) {
      // Find connection index and remove it from hashtable
      if (
        ~(connectionIndex = _.findIndex(connections, {
          id: ws.id,
        }))
      ) {
        connections.splice(connectionIndex, 1);
      }

      // Remove session from sessions hashtable
      delete sessions[ws.id];

      // Notify all connections
      notifyConnections(ws.id);
    });

    ws.on('error', function (error) {
      if (
        ~(connectionIndex = _.findIndex(connections, {
          id: ws.id,
        }))
      ) {
      }
    });

    ws.on('pong', (data) => {
      ws.isAlive = true;
    });
  });

  // Sockets Ping, Keep Alive
  const interval = setInterval((ping) => {
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping(() => {});
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });

  return wss;
};
