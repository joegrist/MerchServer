# Merch Server

Debug mode: prepend DEBUG=express:*.  Needs MySQL database running, at the mo on port 8889. `Error: connect ECONNREFUSED ::1:8889` probably means the DB isn't started. Web server dishing up the images should be configured with the root at `img/design`.
- You will probably need the Angular CLI `npm install -g @angular/cli`
- Build: `npm run ts`
- Generate thumbnails (kinda deprecated): `npm run generate`
- Start the server: `npm run server`
- Start the admin server: `npm run admin`
- Generate database with all the things: `npm run generate`

# Stripe

- Test card: use 424242 etc
- Valid future date
- Any cvv

# FIXME

- On purchase complete, clear cart
