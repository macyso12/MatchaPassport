import { useState } from 'react';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';

export function AuthTest() {
  const [status, setStatus] = useState('Ready to test');

  const testConnection = () => {
    setStatus('Testing Firebase connection...');
    
    // Test if Firebase is configured properly
    if (auth.app.options.projectId) {
      setStatus(`✓ Firebase configured with project: ${auth.app.options.projectId}`);
    } else {
      setStatus('✗ Firebase not configured properly');
    }
    
    // Check current domain
    const currentDomain = window.location.hostname;
    setStatus(prev => prev + `\n✓ Current domain: ${currentDomain}`);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 m-4">
      <h3 className="font-semibold mb-2">Firebase Connection Test</h3>
      <Button onClick={testConnection} className="mb-2">
        Test Connection
      </Button>
      <pre className="text-xs bg-white p-2 rounded border whitespace-pre-wrap">
        {status}
      </pre>
    </div>
  );
}