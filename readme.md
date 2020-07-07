To run program locally, first install server and client dependencies. <br />
To do that, at root folder type "npm install && npm run client-install" <br />
After installing dependencies, while still at root folder, type "npm run dev" to run client and server concurrently. <br />
You'll need to change "process.env.MONGODB_URI" in index.js file to your MongoDB URI in order for this app to work.
