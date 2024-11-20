import { Server } from 'http';
import app from './app';
import config from './config';
const port = config.port || 3300;

async function main() {
  const server: Server = app.listen(port, () => {
    console.log('Doc Point is listening on port ', port);
  });
}

main();
