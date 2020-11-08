// Datastax

import cassandra from 'cassandra-driver'
import root from 'app-root-path'
import monk from 'monk'

const client = new cassandra.Client({
  cloud: { secureConnectBundle: (root + '/driver/secure-connect-bucket.zip') },
  credentials: { username: 'nabeel', password: 'X6-]7Pzq^B9>&_L@' },
  keyspace: 'data'
})

function createTable () {
  const query = 'CREATE TABLE IF NOT EXISTS data.users (id int PRIMARY KEY, lastname text, email text, firstname text);'
  return client.execute(query)
}

export default function handler (req, res) {
  if (req.method === 'POST') {
    createTable()
    if (req.body.googleId) {
      const user = req.body
      if (user.googleId) {
        _getNotes(res, user.googleId)
      }
    }
  } else {
    res.send('Method not allowed')
  }
}

function insertUser (id, lastname, email, firstname) {
  // TO DO: execute a simple statement that inserts one user into the table
  const insert = 'INSERT INTO users (id, lastname, email, firstname) VALUES (?,?,?,?,?)'
  const params = [id, lastname, email, firstname]
  return client.execute(insert, params)
}

function selectUser (lastname) {
  // TO DO: execute a simple statement that retrieves one user from the table
  const select = 'SELECT firstname, age FROM users WHERE lastname = :lastname'
  const params = [lastname]
  return client.execute(select, params)
}

async function writeDoc () {
  await client.connect()
  // await insertUser(user, id, lname, email, fname)
  const rs1 = await selectUser('Jones')
  const user1 = rs1.first()

  if (user1) {
    console.log('name = %s, age = %d', user1.firstname, user1.age)
  } else {
    console.log('No results')
  }

  // await updateUser(36, 'Jones')

  const rs2 = await selectUser('Jones')
  const user2 = rs2.first()

  if (user2) {
    console.log('name = %s, age = %d', user2.firstname, user2)
  }
}

const db = monk('mongodb+srv://na-admin:tYPhfsVwT63qFuuy@bucket1.qpofb.mongodb.net/locker')
const col = db.get('notes')

function _getNotes (res, id) {
  col.find({ id })
    .then(response => {
      res.send(response)
    })
}
