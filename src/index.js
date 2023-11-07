import { app } from './app.js';

import './utils/database.js';

async function main () {
  app.listen(app.get('port'));
  console.log('Server on Port', app.get('port'));
}

main();
