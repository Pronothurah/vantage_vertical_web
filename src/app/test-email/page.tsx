'use client';

import { useState, useEffect } from 'react';

interface EmailTestStatus {
  isConfigured: boolean;
  isTestMode: boolean;
  isDevelopmentMode: boolean;
  canSendEmails: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
  circuitBreakerOpen: boolean;
  metrics?: {
    totalOperations: number;
    successRate: number;
    averageRetryCount: number;
    averageDuration: number;
  };
}

interface TestResults {
  timestamp: string;
  testMode: boolean;
  configValidation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
  connectionTest?: {
    success: boolean;
    error?: string;
    responseTime?: number;
  };
  testEmail?: {
    success: boolean;
    messageId?: string;
    recipient: string;
    retryCount: number;
    error?: {
      message: string;
      type: string;
      retryable: boolean;
    };
  };
  developmentLogs?: Array<{
    timestamp: string;
    to: string;
    subject: string;
    from: string;
  }>;
}

export default function EmailTestPage() {
  const [status, setStatus] = useState<EmailTestStatus | null>(null);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [testRecipient, setTestRecipient] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load initial status
  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const response = await fetch('/api/email-test');
      const data = await response.json();
      
      if (data.success) {
        setStatus(data.status);
      } else {
        setError('Failed to load email service status');
      }
    } catch (err) {
      setError('Failed to connect to email service');
    }
  };

  const runConfigTest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/email-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'test-config' }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTestResults(data.results);
      } else {
        setError(data.error || 'Configuration test failed');
      }
    } catch (err) {
      setError('Failed to run configuration test');
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/email-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action: 'send-test-email',
          recipient: testRecipient || undefined,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTestResults(data.results);
      } else {
        setError(data.error || 'Test email failed');
      }
    } catch (err) {
      setError('Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = async () => {
    try {
      const response = await fetch('/api/email-test', {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Reload status to refresh logs
        await loadStatus();
        setTestResults(null);
      } else {
        setError(data.message || 'Failed to clear logs');
      }
    } catch (err) {
      setError('Failed to clear development logs');
    }
  };

  const StatusIndicator = ({ success, label }: { success: boolean; label: string }) => (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${success ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className={success ? 'text-green-700' : 'text-red-700'}>{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Email Configuration Test</h1>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="text-red-400">⚠</div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* Current Status */}
          {status && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Status</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <StatusIndicator success={status.isConfigured} label="SMTP Configured" />
                  <StatusIndicator success={status.canSendEmails} label="Can Send Emails" />
                  <StatusIndicator success={status.isDevelopmentMode} label="Development Mode" />
                  <StatusIndicator success={status.isTestMode} label="Test Mode" />
                  <StatusIndicator success={!status.circuitBreakerOpen} label="Service Available" />
                </div>
                
                {status.metrics && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Total Operations</div>
                        <div className="font-medium">{status.metrics.totalOperations}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Success Rate</div>
                        <div className="font-medium">{(status.metrics.successRate * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Avg Retries</div>
                        <div className="font-medium">{status.metrics.averageRetryCount.toFixed(1)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Avg Duration</div>
                        <div className="font-medium">{status.metrics.averageDuration.toFixed(0)}ms</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {(status.errors.length > 0 || status.warnings.length > 0) && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {status.errors.length > 0 && (
                      <div className="mb-3">
                        <h3 className="text-sm font-medium text-red-700 mb-1">Errors</h3>
                        <ul className="text-sm text-red-600 space-y-1">
                          {status.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {status.warnings.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-yellow-700 mb-1">Warnings</h3>
                        <ul className="text-sm text-yellow-600 space-y-1">
                          {status.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                {status.recommendations.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-blue-700 mb-1">Recommendations</h3>
                    <ul className="text-sm text-blue-600 space-y-1">
                      {status.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Test Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Actions</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={runConfigTest}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Testing...' : 'Test Configuration'}
                </button>
                
                <button
                  onClick={loadStatus}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Refresh Status
                </button>
                
                {status?.isTestMode && (
                  <button
                    onClick={clearLogs}
                    disabled={loading}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Clear Dev Logs
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-64">
                  <label htmlFor="testRecipient" className="block text-sm font-medium text-gray-700 mb-1">
                    Test Email Recipient (optional)
                  </label>
                  <input
                    type="email"
                    id="testRecipient"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    placeholder="Leave empty to use default contact email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={sendTestEmail}
                  disabled={loading || !status?.isConfigured}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Test Email'}
                </button>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Results</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-4">
                  Test completed at: {new Date(testResults.timestamp).toLocaleString()}
                  {testResults.testMode && (
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                      TEST MODE
                    </span>
                  )}
                </div>
                
                {/* Configuration Validation */}
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Configuration Validation</h3>
                  <StatusIndicator 
                    success={testResults.configValidation.isValid} 
                    label={testResults.configValidation.isValid ? 'Valid' : 'Invalid'} 
                  />
                  
                  {testResults.configValidation.errors.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-red-700">Errors:</div>
                      <ul className="text-sm text-red-600 ml-4">
                        {testResults.configValidation.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {testResults.configValidation.warnings.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-yellow-700">Warnings:</div>
                      <ul className="text-sm text-yellow-600 ml-4">
                        {testResults.configValidation.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Connection Test */}
                {testResults.connectionTest && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Connection Test</h3>
                    <StatusIndicator 
                      success={testResults.connectionTest.success} 
                      label={testResults.connectionTest.success ? 'Connected' : 'Failed'} 
                    />
                    
                    {testResults.connectionTest.responseTime && (
                      <div className="text-sm text-gray-600 mt-1">
                        Response time: {testResults.connectionTest.responseTime}ms
                      </div>
                    )}
                    
                    {testResults.connectionTest.error && (
                      <div className="text-sm text-red-600 mt-1">
                        Error: {testResults.connectionTest.error}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Test Email */}
                {testResults.testEmail && (
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 mb-2">Test Email</h3>
                    <StatusIndicator 
                      success={testResults.testEmail.success} 
                      label={testResults.testEmail.success ? 'Sent' : 'Failed'} 
                    />
                    
                    <div className="text-sm text-gray-600 mt-1">
                      Recipient: {testResults.testEmail.recipient}
                    </div>
                    
                    {testResults.testEmail.messageId && (
                      <div className="text-sm text-gray-600">
                        Message ID: {testResults.testEmail.messageId}
                      </div>
                    )}
                    
                    {testResults.testEmail.retryCount > 0 && (
                      <div className="text-sm text-yellow-600">
                        Required {testResults.testEmail.retryCount} retries
                      </div>
                    )}
                    
                    {testResults.testEmail.error && (
                      <div className="text-sm text-red-600 mt-1">
                        Error: {testResults.testEmail.error.message}
                        <br />
                        Type: {testResults.testEmail.error.type}
                        <br />
                        Retryable: {testResults.testEmail.error.retryable ? 'Yes' : 'No'}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Development Logs */}
                {testResults.developmentLogs && testResults.developmentLogs.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Recent Development Logs</h3>
                    <div className="space-y-2">
                      {testResults.developmentLogs.map((log, index) => (
                        <div key={index} className="text-sm bg-white p-2 rounded border">
                          <div className="font-medium">{log.subject}</div>
                          <div className="text-gray-600">
                            To: {log.to} | From: {log.from}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Configuration Help */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration Help</h2>
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Required Environment Variables</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div><code className="bg-blue-100 px-1 rounded">SMTP_HOST</code> - SMTP server hostname (e.g., smtp.gmail.com)</div>
                <div><code className="bg-blue-100 px-1 rounded">SMTP_PORT</code> - SMTP server port (587 for STARTTLS, 465 for SSL)</div>
                <div><code className="bg-blue-100 px-1 rounded">SMTP_USER</code> - Your email address</div>
                <div><code className="bg-blue-100 px-1 rounded">SMTP_PASS</code> - Your email password or app-specific password</div>
              </div>
              
              <h3 className="font-medium text-blue-900 mb-2 mt-4">Optional Environment Variables</h3>
              <div className="text-sm text-blue-800 space-y-1">
                <div><code className="bg-blue-100 px-1 rounded">SMTP_FROM</code> - Sender email address (defaults to SMTP_USER)</div>
                <div><code className="bg-blue-100 px-1 rounded">SMTP_FROM_NAME</code> - Sender name</div>
                <div><code className="bg-blue-100 px-1 rounded">CONTACT_EMAIL</code> - Default recipient for form submissions</div>
                <div><code className="bg-blue-100 px-1 rounded">EMAIL_TEST_MODE</code> - Set to 'true' to log emails instead of sending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}