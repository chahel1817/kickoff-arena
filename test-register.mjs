import fetch from 'node-fetch';

const testRegister = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'testuser123',
                password: 'Password123!'
            })
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Response:', text);
        
        try {
            const json = JSON.parse(text);
            console.log('Parsed JSON:', json);
        } catch (e) {
            console.log('Could not parse as JSON');
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testRegister();
