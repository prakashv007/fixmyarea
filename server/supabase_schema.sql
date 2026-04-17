-- Create the complaints table in Supabase
CREATE TABLE complaints (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ticket_id TEXT UNIQUE NOT NULL,
    citizen_name TEXT,
    citizen_phone TEXT,
    citizen_email TEXT,
    citizen_gender TEXT,
    citizen_address TEXT,
    citizen_pincode TEXT,
    area TEXT,
    locality TEXT,
    street_name TEXT,
    specific_location TEXT,
    category TEXT,
    title TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    text TEXT,
    normalized_text TEXT,
    department TEXT,
    priority_score INTEGER,
    severity_label TEXT,
    estimated_resolution_time TEXT,
    sla_risk BOOLEAN DEFAULT FALSE,
    location TEXT,
    status TEXT DEFAULT 'OPEN',
    "slaDeadline" TIMESTAMP WITH TIME ZONE,
    "isSlaBreachWarning" BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
-- ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Note: For the hackathon, you may want to disable RLS or create a service role policy.
-- Alternatively, to allow anonymous inserts and selects (for demo):
-- CREATE POLICY "Enable access for all users" ON complaints FOR ALL USING (true);
