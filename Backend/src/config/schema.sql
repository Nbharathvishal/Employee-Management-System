CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'EMPLOYEE')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  department VARCHAR(50),
  designation VARCHAR(50),
  position VARCHAR(50),
  date_of_joining DATE DEFAULT CURRENT_DATE,
  hire_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  leave_balance INTEGER DEFAULT 3,
  leave_reset_at DATE DEFAULT CURRENT_DATE,
  salary NUMERIC DEFAULT 0,
  address TEXT,
  emergency_contact VARCHAR(100),
  employee_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE attendance (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  date DATE NOT NULL,
  punch_in TIME,
  punch_out TIME,
  total_hours NUMERIC,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_employee_attendance
    FOREIGN KEY (employee_id)
    REFERENCES employees(id)
    ON DELETE CASCADE,

  CONSTRAINT unique_attendance UNIQUE (employee_id, date)
);

CREATE TABLE leaves (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  leave_type VARCHAR(50),
  reason TEXT,
  from_date DATE,
  to_date DATE,
  status VARCHAR(20) DEFAULT 'PENDING',
  admin_remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_employee_leave
    FOREIGN KEY (employee_id)
    REFERENCES employees(id)
    ON DELETE CASCADE
);


CREATE TABLE employee_notes (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL,
  title VARCHAR(100),
  content TEXT NOT NULL,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_employee_notes
    FOREIGN KEY (employee_id)
    REFERENCES employees(id)
    ON DELETE CASCADE
);
