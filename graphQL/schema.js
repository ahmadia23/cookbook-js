const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type AuthData {
    authData: {
      token: String!
      userId: ID!
    }
  }

  type UserInputData {
    email: String!
    password: String!
  }

  type Auth {
    login: (UserInput: UserInputData) :AuthData!
  }

  schema {
    mutation: Auth
  }

`)
