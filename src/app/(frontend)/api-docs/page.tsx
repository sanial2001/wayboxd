'use client';

import { useEffect, useState } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function ApiDocsSwagger({ spec }: { spec: Record<string, unknown> }) {
  return (
    <SwaggerUI
      spec={spec}
      defaultModelsExpandDepth={-1}
      persistAuthorization={true}
      supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch']}
      tryItOutEnabled={true}
      filter={true}
      requestSnippetsEnabled={true}
      deepLinking={true}
      displayRequestDuration={true}
      docExpansion="list"
      defaultModelExpandDepth={1}
      requestInterceptor={(req: Record<string, unknown>) => {
        (req as { credentials?: string }).credentials = 'include';
        return req;
      }}
    />
  );
}

export default function ApiDocsPage() {
  const [swaggerSpec, setSwaggerSpec] = useState<Record<string, unknown> | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSwaggerSpec = async () => {
      try {
        const response = await fetch('/api/docs/swagger.json');
        if (!response.ok) {
          setIsUnavailable(true);
          return;
        }
        const data: Record<string, unknown> = await response.json();
        setSwaggerSpec(data);
      } catch {
        setIsUnavailable(true);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchSwaggerSpec();
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .swagger-ui .topbar {
        display: none !important;
      }
      .api-header {
        background-color: #fff;
        border-bottom: 1px solid #e5e7eb;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .api-header h1 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #111827;
        margin: 0;
      }
      .api-header .download-btn {
        background-color: #111827;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        text-decoration: none;
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading API documentation...</p>
      </div>
    );
  }

  if (isUnavailable || !swaggerSpec) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
          <p className="mb-2 text-xl text-gray-600">Page Not Found</p>
          <p className="text-gray-500">This page is not available in production.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="swagger-wrapper">
      <div className="api-header">
        <h1>Wayboxd API Documentation</h1>
        <a href="/api/docs/swagger.json" download="wayboxd-swagger.json" className="download-btn">
          Download Spec
        </a>
      </div>
      <ApiDocsSwagger spec={swaggerSpec} />
    </div>
  );
}
