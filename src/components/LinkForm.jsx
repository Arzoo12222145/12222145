import { useState } from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

export default function LinkForm() {
  const [url, setUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [validity, setValidity] = useState(30);
  const [shortLink, setShortLink] = useState('');
  const [expiry, setExpiry] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/shorturls', {
        url,
        shortcode: shortcode || undefined,
        validity: parseInt(validity)
      });
      setShortLink(res.data.shortLink);
      setExpiry(res.data.expiry);
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating short URL');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="url"
          placeholder="Enter full URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Custom shortcode (optional)"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Validity in minutes"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Shorten URL
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {shortLink && (
        <div className="mt-6 text-center">
          <p className="font-semibold text-green-600">Short URL:</p>
          <a href={shortLink} target="_blank" rel="noreferrer" className="text-blue-500 underline">
            {shortLink}
          </a>
          <p className="text-sm text-gray-600 mt-1">Expires at: {new Date(expiry).toLocaleString()}</p>
          <div className="mt-4">
            <QRCode value={shortLink} />
          </div>
        </div>
      )}
    </div>
  );
}
