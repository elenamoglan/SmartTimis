const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
    console.log('Login attempt');
    res.json({
        token: 'fake-jwt-token',
        user: {
            id: 1,
            name: 'Citizen Jane',
            email: 'citizen@example.com',
            role: 'CITIZEN'
        }
    });
});

app.get('/api/auth/me', (req, res) => {
     res.json({
        id: 1,
        name: 'Citizen Jane',
        email: 'citizen@example.com',
        role: 'CITIZEN'
    });
});

app.get('/api/issues', (req, res) => {
    console.log('Fetching issues');
    res.json([
            {
                id: 1,
                title: 'Pothole on Main St',
                status: 'OPEN',
                description: 'Large pothole causing traffic slowdowns near the bakery. Needs urgent repair.',
                image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
                latitude: 45.7489,
                longitude: 21.2087,
                created_at: new Date().toISOString(),
                reporter_name: 'John Doe'
            },
            {
                id: 2,
                title: 'Broken Streetlight',
                status: 'IN_PROGRESS',
                description: 'Streetlight flickering constantly at night. Safety hazard for pedestrians.',
                image_url: 'https://images.unsplash.com/photo-1542662565-7e4b66b5adaa?auto=format&fit=crop&q=80&w=400',
                latitude: 45.7500,
                longitude: 21.2100,
                created_at: new Date(Date.now() - 86400000).toISOString(),
                reporter_name: 'Jane Smith'
            },
            {
                id: 3,
                title: 'Illegal Dumping',
                status: 'RESOLVED',
                description: 'Pile of trash left in the park corner. Please clean up.',
                image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
                latitude: 45.7520,
                longitude: 21.2050,
                created_at: new Date(Date.now() - 172800000).toISOString(),
                reporter_name: 'Mike Johnson'
            }
    ]);
});

app.listen(3000, '0.0.0.0', () => console.log('Mock server running on port 3000'));
