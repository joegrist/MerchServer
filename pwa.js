const { execSync } = require('child_process');
process.chdir('pwa')
execSync(`ng serve --ssl --ssl-key "../ssl/pwa-key.pem" --ssl-cert "../ssl/pwa-cert.pem"`, {stdio: 'inherit'})
