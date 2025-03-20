import Layout from '@/components/Layout'
import Link from 'next/link'

export default function Documentation() {
  return (
    <Layout>
      <main className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Documentation
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Everything you need to integrate and use our platform effectively
            </p>
          </div>
        </section>

        {/* Main Documentation Content */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <div className="md:col-span-1 space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Getting Started</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#introduction" className="text-gray-300 hover:text-white transition-colors">
                        Introduction
                      </a>
                    </li>
                    <li>
                      <a href="#quick-start" className="text-gray-300 hover:text-white transition-colors">
                        Quick Start Guide
                      </a>
                    </li>
                    <li>
                      <a href="#authentication" className="text-gray-300 hover:text-white transition-colors">
                        Authentication
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">API Reference</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#rest-api" className="text-gray-300 hover:text-white transition-colors">
                        REST API
                      </a>
                    </li>
                    <li>
                      <a href="#webhooks" className="text-gray-300 hover:text-white transition-colors">
                        Webhooks
                      </a>
                    </li>
                    <li>
                      <a href="#sdks" className="text-gray-300 hover:text-white transition-colors">
                        SDKs
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Guides</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#integration" className="text-gray-300 hover:text-white transition-colors">
                        Integration Guide
                      </a>
                    </li>
                    <li>
                      <a href="#best-practices" className="text-gray-300 hover:text-white transition-colors">
                        Best Practices
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Main Content */}
              <div className="md:col-span-3 space-y-12">
                {/* Introduction Section */}
                <section id="introduction" className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">Introduction</h2>
                  <p className="text-gray-300">
                    Our API allows you to integrate our optical product catalog, ordering system, 
                    and prescription management into your existing workflows. This documentation 
                    will guide you through the process of implementing our solutions.
                  </p>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <pre className="text-gray-300 font-mono text-sm">
                      <code>{`curl -X GET "https://api.opticaleyewear.com/v1/products" \
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
                    </pre>
                  </div>
                </section>

                {/* Quick Start Section */}
                <section id="quick-start" className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">Quick Start Guide</h2>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white">1. Get Your API Key</h3>
                    <p className="text-gray-300">
                      Sign up for an account and obtain your API key from the dashboard.
                    </p>

                    <h3 className="text-xl font-semibold text-white">2. Make Your First Request</h3>
                    <p className="text-gray-300">
                      Use your API key to authenticate and make your first API request.
                    </p>

                    <div className="bg-gray-800 p-6 rounded-lg">
                      <pre className="text-gray-300 font-mono text-sm">
                        <code>{`import { OpticalEyewear } from '@optical-eyewear/sdk';

const client = new OpticalEyewear('YOUR_API_KEY');
const products = await client.products.list();`}</code>
                      </pre>
                    </div>
                  </div>
                </section>

                {/* More sections... */}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-gray-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-gray-300 mb-8">
              Create an account to get your API key and start integrating today.
            </p>
            <Link
              href="/auth/register"
              className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors inline-block"
            >
              Sign Up for Free
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  )
} 