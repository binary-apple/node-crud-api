import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;
const server = http.createServer();

server.listen(PORT, () => console.log(`App is listening on url http://localhost:${PORT}`));
