const { gql } = require('apollo-server-express');

module.exports = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    created_at: String
  }
  type AuthPayload {
    token: String!
    user: User!
  }
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
  type DeleteResponse {
    message: String!
    id: ID!
  }
  type Query {
    getAllEmployees: [Employee!]!
    searchEmployeeById(eid: ID!): Employee
    searchEmployeeByDesignation(designation: String!): [Employee!]!
    searchEmployeeByDepartment(department: String!): [Employee!]!
  }
  type Mutation {
    signup(username: String!, email: String!, password: String!): AuthPayload!
    login(username: String!, password: String!): AuthPayload!
    addEmployee(first_name: String!, last_name: String!, email: String!, gender: String!, designation: String!, department: String!, salary: Float!, date_of_joining: String!, employee_photo: String): Employee!
    updateEmployee(eid: ID!, first_name: String, last_name: String, email: String, gender: String, designation: String, department: String, salary: Float, date_of_joining: String, employee_photo: String): Employee!
    deleteEmployee(eid: ID!): DeleteResponse!
  }
`;
