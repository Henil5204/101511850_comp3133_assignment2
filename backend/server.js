require('dotenv').config();
<<<<<<< HEAD
const express          = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose         = require('mongoose');
const cors             = require('cors');
const jwt              = require('jsonwebtoken');
const typeDefs         = require('./graphql/typeDefs');
const resolvers        = require('./graphql/resolvers');
const User             = require('./models/User');
=======
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const User = require('./models/User');
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391

async function buildContext({ req }) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return { user: null };
  try {
    const { id } = jwt.verify(header.slice(7), process.env.JWT_SECRET);
<<<<<<< HEAD
    const user   = await User.findById(id).select('-password');
=======
    const user = await User.findById(id).select('-password');
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391
    return { user };
  } catch { return { user: null }; }
}

async function start() {
  const app = express();
<<<<<<< HEAD

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
=======
  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.get('/health', (_, res) => res.json({ status: 'ok' }));

  const server = new ApolloServer({ typeDefs, resolvers, context: buildContext,
    formatError: (err) => ({ message: err.message }) });
  await server.start();
  server.applyMiddleware({ app, path: '/graphql', cors: false });

  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/comp3133_assignment2');
  console.log('MongoDB connected');

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

start().catch(err => { console.error(err); process.exit(1); });
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391
