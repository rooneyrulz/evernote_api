const { buildSchema } = require('graphql');

module.exports = buildSchema(`

type Note {
  _id: ID!
  title: String!
  content: String!
  private: Boolean!
  creator: User!
  date: String!
}

type User {
  _id: ID!
  email: String!
  password: String
  createdNotes: [Note!]
  date: String!
}

type AuthData {
  token: String!,
  user: User!
}

input NoteInput {
  title: String!
  content: String!
  private: Boolean!
}

input UserInput {
  email: String!
  password: String!
}

type RootQuery {
  notes: [Note!]!
}

type RootMutation {
  createNote(noteInput: NoteInput): Note
  createUser(userInput: UserInput): AuthData
  loginUser(userInput: UserInput): AuthData
}

schema {
  query: RootQuery
  mutation: RootMutation
}
`);