# AlumniNet Backend
This backend ctr management control shcolarship students.

## How to Get Started
Clone the repository and install dependencies

```bash
https://github.com/Sourcedevkh/alumniNet-api.git
cd alumniNet-api
npm install
```

Run the setup script to configure your environment variables, initialize the database, and populate it with sample data:

```bash
npm run setup
```

This script will:

- Create a ```.env``` the Backend 
- Connection database ```MySQL``` 
- Expires jwt

## Architecture ERD

```mermaid
erDiagram

    scholarship_types ||--o{ scholarship_subtypes : has
    scholarship_subtypes ||--o{ scholarship_tracks : has
    scholarship_types ||--o{ scholarships : categorizes
    scholarship_subtypes ||--o{ scholarships : categorizes
    scholarship_tracks ||--o{ scholarships : categorizes

    scholarships ||--o{ generations : assigned_to
    scholarships ||--o{ classes : used_in
    scholarships ||--o{ students : assigned_to

    generations ||--o{ classes : contains
    generations ||--o{ students : belongs_to

    shifts ||--o{ classes : scheduled_in
    shifts ||--o{ students : assigned_to

    classes ||--o{ class_students : has
    students ||--o{ class_students : enrolls

    students ||--o{ scores : receives
    subjects ||--o{ scores : evaluated_in

    students ||--o{ grades : has
    students ||--o{ certificates : issued

    users ||--o{ user_devices : owns
    users ||--o{ login_attempts : tracks
    users ||--o{ user_login_logs : logs


    scholarship_types {
        int id PK
        string name
    }

    scholarship_subtypes {
        int id PK
        int type_id FK
        string name
    }

    scholarship_tracks {
        int id PK
        int subtype_id FK
        string name
    }

    scholarships {
        int id PK
        int type_id FK
        int subtype_id FK
        int track_id FK
        string name
    }

    generations {
        int id PK
        int scholarship_id FK
        string name
        int start_year
        int end_year
    }

    shifts {
        int id PK
        int name
    }

    classes {
        int id PK
        int generation_id FK
        int scholarship_id FK
        int shift_id FK
        string name
    }

    students {
        int id PK
        int generation_id FK
        int scholarship_id FK
        int shift_id FK
        string fullname
        string email
    }

    class_students {
        int id PK
        int student_id FK
        int class_id FK
    }

    subjects {
        int id PK
        string name
        int credit
    }

    scores {
        int id PK
        int student_id FK
        int subject_id FK
        int score
    }

    grades {
        int id PK
        int student_id FK
        string grade
        decimal gpa
    }

    certificates {
        int id PK
        int student_id FK
        string qr_token
    }

    users {
        int id PK
        string fullname
        string email
        string password
    }

    user_devices {
        int id PK
        int user_id FK
        string device_id
    }

    login_attempts {
        int id PK
        int user_id FK
        string device_id
    }

    user_login_logs {
        int id PK
        int user_id FK
        string ip_address
    }
```


## Data Flow Diagram (DFD) 

This link DFD AlumniNet handler by teams
```bash
https://www.figma.com/board/rfimfi3raLKQMN0NTBRzXv/DFD?node-id=0-1&p=f&t=TMOd8c71EM0zIMaP-0
```

## Entity-Relationship Diagram (ERD)

Link ERD AlumniNet 
```bash
https://app.diagrams.net/#G1ap1pF7XEU4Yz5HrFcLFizsA_vNkqydbO#%7B%22pageId%22%3A%22DXpJS6MCztRd8iwsVssI%22%7D
```