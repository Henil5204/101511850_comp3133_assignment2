import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { from, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Employee {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  designation: string;
  department: string;
  salary: number;
  date_of_joining: string;
  employee_photo?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  user: { _id: string; username: string; email: string; };
}

@Injectable({ providedIn: 'root' })
export class GraphqlService {
  private http: AxiosInstance;

  constructor() {
    this.http = axios.create({
      baseURL: environment.graphqlUrl,
      headers: { 'Content-Type': 'application/json' }
    });
    this.http.interceptors.request.use(config => {
      const token = localStorage.getItem('emptrack_token');
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    });
  }

  private gql<T>(query: string, variables?: Record<string, unknown>): Observable<T> {
    return from(
      this.http.post<{ data: Record<string, unknown>; errors?: { message: string }[] }>('', { query, variables })
        .then(res => {
          if (res.data.errors?.length) throw new Error(res.data.errors[0].message);
          const key = Object.keys(res.data.data)[0];
          return res.data.data[key] as T;
        })
    );
  }

  // ── Auth ─────────────────────────────────────────────
  login(username: string, password: string): Observable<AuthResponse> {
    return this.gql<AuthResponse>(`
      mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
          token
          user { _id username email }
        }
      }`, { username, password });
  }

  signup(username: string, email: string, password: string): Observable<AuthResponse> {
    return this.gql<AuthResponse>(`
      mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
          token
          user { _id username email }
        }
      }`, { username, email, password });
  }

  // ── Employees ─────────────────────────────────────────
  getAllEmployees(): Observable<Employee[]> {
    return this.gql<Employee[]>(`
      query {
        getAllEmployees {
          _id first_name last_name email gender
          designation department salary date_of_joining
          employee_photo created_at updated_at
        }
      }`);
  }

  searchEmployeeById(eid: string): Observable<Employee> {
    return this.gql<Employee>(`
      query SearchById($eid: ID!) {
        searchEmployeeById(eid: $eid) {
          _id first_name last_name email gender
          designation department salary date_of_joining
          employee_photo created_at updated_at
        }
      }`, { eid });
  }

  searchByDesignation(designation: string): Observable<Employee[]> {
    return this.gql<Employee[]>(`
      query SearchByDesignation($designation: String!) {
        searchEmployeeByDesignation(designation: $designation) {
          _id first_name last_name email gender
          designation department salary date_of_joining employee_photo
        }
      }`, { designation });
  }

  searchByDepartment(department: string): Observable<Employee[]> {
    return this.gql<Employee[]>(`
      query SearchByDepartment($department: String!) {
        searchEmployeeByDepartment(department: $department) {
          _id first_name last_name email gender
          designation department salary date_of_joining employee_photo
        }
      }`, { department });
  }

  addEmployee(emp: Omit<Employee, '_id' | 'created_at' | 'updated_at'>): Observable<Employee> {
    return this.gql<Employee>(`
      mutation AddEmployee(
        $first_name: String!, $last_name: String!, $email: String!,
        $gender: String!, $designation: String!, $department: String!,
        $salary: Float!, $date_of_joining: String!, $employee_photo: String
      ) {
        addEmployee(
          first_name: $first_name, last_name: $last_name, email: $email,
          gender: $gender, designation: $designation, department: $department,
          salary: $salary, date_of_joining: $date_of_joining,
          employee_photo: $employee_photo
        ) { _id first_name last_name email gender designation department salary date_of_joining employee_photo }
      }`, emp as Record<string, unknown>);
  }

  updateEmployee(eid: string, updates: Partial<Employee>): Observable<Employee> {
    return this.gql<Employee>(`
      mutation UpdateEmployee(
        $eid: ID!, $first_name: String, $last_name: String, $email: String,
        $gender: String, $designation: String, $department: String,
        $salary: Float, $date_of_joining: String, $employee_photo: String
      ) {
        updateEmployee(
          eid: $eid, first_name: $first_name, last_name: $last_name,
          email: $email, gender: $gender, designation: $designation,
          department: $department, salary: $salary,
          date_of_joining: $date_of_joining, employee_photo: $employee_photo
        ) { _id first_name last_name email gender designation department salary date_of_joining employee_photo updated_at }
      }`, { eid, ...updates });
  }

  deleteEmployee(eid: string): Observable<{ message: string; id: string }> {
    return this.gql<{ message: string; id: string }>(`
      mutation DeleteEmployee($eid: ID!) {
        deleteEmployee(eid: $eid) { message id }
      }`, { eid });
  }
}
