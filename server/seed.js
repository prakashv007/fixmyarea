const { insertComplaint } = require('./database');

const dummyComplaints = [
    {
        ticket_id: 'TKT-A1B2C3',
        text: 'Massive water leak on 5th Avenue near the park.',
        normalized_text: 'Report of a high-volume water leak at 5th Avenue location requiring urgent attention.',
        department: 'Water Supply',
        priority_score: 9,
        severity_label: 'Critical',
        estimated_resolution_time: '2-4 Hours',
        sla_risk: true,
        location: '12.9716,77.5946',
        status: 'OPEN'
    },
    {
        ticket_id: 'TKT-D4E5F6',
        text: 'Street lights are not working on Residency Road.',
        normalized_text: 'Non-functional street lighting reported on Residency Road, affecting visibility.',
        department: 'Electricity',
        priority_score: 5,
        severity_label: 'Medium',
        estimated_resolution_time: '2 Days',
        sla_risk: false,
        location: '12.9650,77.6000',
        status: 'OPEN'
    },
    {
        ticket_id: 'TKT-G7H8I9',
        text: 'Garbage pile-up near the community center.',
        normalized_text: 'Accumulation of uncollected waste at the community center premises.',
        department: 'Sanitation',
        priority_score: 4,
        severity_label: 'Low',
        estimated_resolution_time: '1 Day',
        sla_risk: false,
        location: '12.9800,77.5800',
        status: 'IN_PROGRESS'
    },
    {
        ticket_id: 'TKT-J0K1L2',
        text: 'Large pothole at the main intersection causing tire damage.',
        normalized_text: 'Hazardous pothole at main intersection necessitating immediate road repair.',
        department: 'Roads & Traffic',
        priority_score: 8,
        severity_label: 'High',
        estimated_resolution_time: '24 Hours',
        sla_risk: true,
        location: '12.9500,77.6100',
        status: 'OPEN'
    },
    {
        ticket_id: 'TKT-M3N4O5',
        text: 'Fallen tree blocking lane B after last night\'s wind.',
        normalized_text: 'Obstruction of Lane B due to a fallen tree following severe weather.',
        department: 'Public Safety',
        priority_score: 7,
        severity_label: 'High',
        estimated_resolution_time: '12 Hours',
        sla_risk: false,
        location: '12.9900,77.6200',
        status: 'OPEN'
    }
];

async function seed() {
    console.log('Seeding dummy data...');
    for (const complaint of dummyComplaints) {
        try {
            await insertComplaint(complaint);
            console.log(`Inserted ${complaint.ticket_id}`);
        } catch (err) {
            console.error(`Failed to insert ${complaint.ticket_id}: ${err.message}`);
        }
    }
    console.log('Seeding complete.');
    process.exit();
}

seed();
