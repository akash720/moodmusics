const cron = require('node-cron');
const shell = require('shelljs');

// Schedule tasks to be run on the server.
cron.schedule('*/1 * * * *', function() {
  console.log('Running clear memory cron job');
  shell.exec('./clear_mem.sh >> /dev/null 2>&1');
});