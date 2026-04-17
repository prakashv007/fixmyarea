const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl === 'your_supabase_project_url_here') {
    console.error('CRITICAL: Supabase credentials missing in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase Sentinel Client Initialized.');

const insertComplaint = async (complaint) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .insert([complaint])
            .select();
            
        if (error) throw error;
        return data[0].id;
    } catch (err) {
        console.error('Error inserting complaint into Supabase:', err.message);
        throw err;
    }
};

const getAllComplaints = async () => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .order('timestamp', { ascending: false });
            
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Error fetching complaints from Supabase:', err.message);
        return [];
    }
};

const getComplaintByTicketId = async (ticketId) => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .eq('ticket_id', ticketId)
            .single();
            
        if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
        return data || null;
    } catch (err) {
        console.error('Error fetching complaint from Supabase:', err.message);
        return null;
    }
};

const updateComplaintStatus = async (ticketId, status, isSlaBreachWarning) => {
    try {
        const updateData = { status };
        if (isSlaBreachWarning !== undefined) {
            updateData.isSlaBreachWarning = isSlaBreachWarning;
        }
        
        const { data, error, count } = await supabase
            .from('complaints')
            .update(updateData)
            .eq('ticket_id', ticketId);
            
        if (error) throw error;
        return 1; // Success
    } catch (err) {
        console.error('Error updating status in Supabase:', err.message);
        throw err;
    }
};

const getCriticalComplaints = async () => {
    try {
        const { data, error } = await supabase
            .from('complaints')
            .select('*')
            .neq('status', 'RESOLVED')
            .eq('isSlaBreachWarning', true)
            .order('slaDeadline', { ascending: true });
            
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error('Error fetching critical complaints from Supabase:', err.message);
        return [];
    }
};

const getDashboardStats = async () => {
    try {
        const complaints = await getAllComplaints();
        const critical = await getCriticalComplaints();
        
        return {
            total: complaints.length,
            open: complaints.filter(c => c.status === 'OPEN').length,
            inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
            resolved: complaints.filter(c => c.status === 'RESOLVED').length,
            criticalQueue: critical
        };
    } catch (err) {
        console.error('Error calculating dashboard stats:', err.message);
        return { total: 0, open: 0, inProgress: 0, resolved: 0, criticalQueue: [] };
    }
};

module.exports = {
  db: supabase,
  insertComplaint,
  getAllComplaints,
  getComplaintByTicketId,
  updateComplaintStatus,
  getCriticalComplaints,
  getDashboardStats
};
