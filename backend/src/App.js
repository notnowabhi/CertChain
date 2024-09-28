const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const NODE_URL = process.env.NODE_URL;

app.post('/issue-certificate', async (req, res) => {
    const { certificateId, recipient, title, issuedAt } = req.body;
    try {
        const txPayload = {
            type: "entry_function_payload",
            function: "0x1::CertificateManagement::issue_certificate",
            arguments: [certificateId, recipient, title, issuedAt],
            type_arguments: []
        };
        const result = await axios.post(`${NODE_URL}/transactions`, txPayload);
        res.json({ txHash: result.data.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/verify-certificate/:address/:certificateId', async (req, res) => {
    const { address, certificateId } = req.params;
    try {
        const result = await axios.get(`${NODE_URL}/accounts/${address}/resources`);
        const isValid = result.data.some(cert => cert.data.certificate_id === parseInt(certificateId));
        res.json({ isValid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3001, () => {
    console.log("CertChain Backend running on port 3001");
});
