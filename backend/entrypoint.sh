#!/bin/sh
echo "Waiting for MongoDB..."
until node -e "
const m = require('mongoose');
m.connect(process.env.MONGODB_URI).then(() => { m.disconnect(); process.exit(0); }).catch(() => process.exit(1));
" 2>/dev/null; do
  sleep 2
  printf '.'
done
echo ""
echo "MongoDB ready."

COUNT=$(node -e "
const m = require('mongoose');
m.connect(process.env.MONGODB_URI).then(async () => {
  const n = await m.connection.db.collection('employees').countDocuments();
  console.log(n);
  m.disconnect();
}).catch(() => console.log(0));
" 2>/dev/null)

if [ "$COUNT" = "0" ]; then
  echo "Seeding database..."
  node seed.js
fi

echo "Starting server..."
exec node server.js