const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
<<<<<<< HEAD
    updated_at: String
  }

=======
  }
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391
  type AuthPayload {
    token: String!
    user: User!
  }
<<<<<<< HEAD

=======
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391
  type Employee {
    _id: ID!
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    designation: String!
    department: String!
    salary: Float!
    date_of_joining: String!
    employee_photo: String
    created_at: String
    updated_at: String
  }
<<<<<<< HEAD

=======
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391
  type DeleteResponse {
    message: String!
    id: ID!
  }
<<<<<<< HEAD

=======
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391
  type Query {
    getAllEmployees: [Employee!]!
    searchEmployeeById(eid: ID!): Employee
    searchEmployeeByDesignation(designation: String!): [Employee!]!
    searchEmployeeByDepartment(department: String!): [Employee!]!
  }
<<<<<<< HEAD

  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!

    addEmployee(
      first_name: String!
      last_name: String!
      email: String!
      gender: String!
      designation: String!
      department: String!
      salary: Float!
      date_of_joining: String!
      employee_photo: String
    ): Employee!

    updateEmployee(
      eid: ID!
      first_name: String
      last_name: String
      email: String
      gender: String
      designation: String
      department: String
      salary: Float
      date_of_joining: String
      employee_photo: String
    ): Employee!

=======
  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    addEmployee(first_name: String!, last_name: String!, email: String!, gender: String!, designation: String!, department: String!, salary: Float!, date_of_joining: String!, employee_photo: String): Employee!
    updateEmployee(eid: ID!, first_name: String, last_name: String, email: String, gender: String, designation: String, department: String, salary: Float, date_of_joining: String, employee_photo: String): Employee!
>>>>>>> 4c8a8b9a6444978bb654de3ea87c66b44c357391
    deleteEmployee(eid: ID!): DeleteResponse!
  }
`;
