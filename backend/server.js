require('dotenv').config();
const express          = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose         = require('mongoose');
const cors             = require('cors');
const jwt              = require('jsonwebtoken');
const typeDefs         = require('./graphql/typeDefs');
const resolvers        = require('./graphql/resolvers');
const User             = require('./models/User');

async function buildContext({ req }) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return { user: null };
  try {
    const { id } = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    const user   = await User.findById(id).select('-password');
    return { user };
  } catch { return { user: null }; }
}

async function start() {
  const app = express();

  // Allow all origins for cloud deployment
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json());

  app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: buildContext,
    formatError: (err) => ({ message: err.message }),
    cache: 'bounded'
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql', cors: false });

  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/comp3133_assignment2';
  await mongoose.connect(MONGO_URI);
  console.log('✅ MongoDB connected');

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL ready → http://localhost:${PORT}/graphql`);
  });
}

start().catch(err => { console.error('❌', err); process.exit(1); });
