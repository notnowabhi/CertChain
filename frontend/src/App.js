import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [certificateId, setCertificateId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [title, setTitle] = useState('');
  const [issuedAt, setIssuedAt] = useState('');
  const [message, setMessage] = useState('');

  const issueCertificate = async () => {
    try {
      const res = await axios.post('http://localhost:3001/issue-certificate', {
        certificateId,
        recipient,
        title,
        issuedAt
      });
      setMessage(`Transaction Hash: ${res.data.txHash}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>CertChain</h1>
      <input
        type="text"
        placeholder="Certificate ID"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Issued At (Timestamp)"
        value={issuedAt}
        onChange={(e) => setIssuedAt(e.target.value)}
      />
      <button onClick={issueCertificate}>Issue Certificate</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
