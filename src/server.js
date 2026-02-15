import dotenv from 'dotenv'
import app from './app.js'

dotenv.config()
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT , () => {
console.log(`\nServer running on port ${PORT}`);
console.log(`➜  Local:   http://localhost:${PORT}/health`);
})

process.on('SIGINT' ,() => {
  console.log('Shutting down server...')
  server.close(() => {
    console.log('Server closed!')
    process.exit(0)
  })
})