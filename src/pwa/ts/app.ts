import * as express from "express"
import * as fs from "fs"
import * as https from "https"
import path = require("path")
import { config, log } from "../../config/globals"

log.log("Starting PWA")

const credentials = {
    key: fs.readFileSync('ssl/pwa-key.pem', 'utf8'),
    cert: fs.readFileSync('ssl/pwa-cert.pem', 'utf8'),
    passphrase: config.PWA_SSL_PASSPHRASE
}

const app = express()

app.use(express.static('../../../public'))

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../../../public/index.html'))
})

https.createServer(credentials, app).listen(8443);
log.log("PWA is up and running on port 8443 (https)")