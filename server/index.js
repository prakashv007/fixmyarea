require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getAllComplaints, getComplaintByTicketId, updateComplaintStatus } = require('./database');
const { submitGrievance } = require('./controllers/grievanceController');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Main Entry Point for Citizens
app.post('/complaint', submitGrievance);

app.get('/complaints', async (req, res) => {
    try {
        const complaints = await getAllComplaints();
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/complaint/:id', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const complaint = await getComplaintByTicketId(ticketId);
        
        if (!complaint) {
            return res.status(404).json({ error: 'Complaint not found.' });
        }
        
        res.status(200).json(complaint);
    } catch (error) {
        console.error('Error fetching complaint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.patch('/complaint/:id', async (req, res) => {
    try {
        const ticketId = req.params.id;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: 'Status is required.' });
        }
        
        const count = await updateComplaintStatus(ticketId, status);
        
        if (count === 0) {
            return res.status(404).json({ error: 'Complaint not found.' });
        }
        
        res.status(200).json({ message: 'Status updated successfully', ticket_id: ticketId, status });
    } catch (error) {
        console.error('Error updating complaint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
