// Node project are initialized with the npm command init
// Import the package http of node, require is the command to import the package
const http = require('http');

// Import the application file (Without the extension .js, it recognizes it)
const app = require('./app');

// This function is as safety one to make sure the port submit is a number and if not,
// the normalizePort will return a valid port
const normalizePort = (val) => {
  // Execute parseInt which convert the val in an integer
  const port = parseInt(val, 10);

  // If port is not a number
  if (isNaN(port)) {
    return val;
  }

  // If port is a number superior or equal to 0
  if (port >= 0) {
    return port;
  }
  return false;
};

// Const port which defines the port to listen
const port = normalizePort(process.env.PORT || '3000');
// Tell the express application she needs to run on the 'port' with the const port
app.set('port', port);

// ErrorHandler function is looking for errors and handles them in an appropriate way. It is then saved in the server
const errorHandler = error => {
  // If the server doesn't hear the call
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  // In case of an error code
  switch (error.code) {
    // This is denied access
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      // Process.exit(1) mean put an end to the process with a failure.
      process.exit(1);
      break;
    // This mean the adress is already in use
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    // By default, it will throw an error
    default:
      throw error;
  }
};

// We pass the application app as an argument to create the server
const server = http.createServer(app);

// If the server has an error, the errorHandler function handle it
server.on('error', errorHandler);

// An event listener is saved, putting on the port or canal in which the server runs in the console
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Listen the req sended
server.listen(port);
