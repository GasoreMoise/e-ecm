import Layout from '@/components/Layout'
import Link from 'next/link'

const pricingPlans = [
  {
    name: 'Starter',
    price: '25',
    description: 'Perfect for small optical retailers',
    features: [
      'Up to 1,000 products',
      'Basic inventory management',
      'Standard support',
      'Basic analytics',
      '2 team members',
      'Email support'
    ],
    cta: 'Get Started',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '75',
    description: 'Ideal for growing optical businesses',
    features: [
      'Up to 10,000 products',
      'Advanced inventory management',
      'Priority support',
      'Advanced analytics',
      'Up to 10 team members',
      'Phone & email support',
      'API access',
      'Custom integrations'
    ],
    cta: 'Start Free Trial',
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large optical chains and manufacturers',
    features: [
      'Unlimited products',
      'Enterprise inventory management',
      'Dedicated support team',
      'Custom analytics',
      'Unlimited team members',
      '24/7 phone & email support',
      'Advanced API access',
      'Custom development',
      'White-label options'
    ],
    cta: 'Contact Sales',
    highlighted: false
  }
]

export default function Pricing() {
  return (
    <Layout>
      <main className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Transparent Pricing for Every Business
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Choose the perfect plan for your optical business needs
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan) => (
                <div 
                  key={plan.name}
                  className={`rounded-2xl p-8 ${
                    plan.highlighted 
                      ? 'bg-white text-gray-900 transform scale-105' 
                      : 'bg-gray-800 text-white'
                  }`}
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">
                        {plan.price === 'Custom' ? '' : '$'}
                        {plan.price}
                      </span>
                      {plan.price !== 'Custom' && (
                        <span className="text-gray-500">/month</span>
                      )}
                    </div>
                    <p className={`${plan.highlighted ? 'text-gray-600' : 'text-gray-300'}`}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <svg
                          className={`w-5 h-5 mr-3 ${
                            plan.highlighted ? 'text-gray-900' : 'text-white'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className={`${
                          plan.highlighted ? 'text-gray-600' : 'text-gray-300'
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.name === 'Enterprise' ? '/contact' : '/auth/register'}
                    className={`block w-full text-center py-3 px-6 rounded-full transition-colors ${
                      plan.highlighted
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-white text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 bg-gray-800/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-white text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Can I switch plans later?
                </h3>
                <p className="text-gray-300">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-300">
                  We accept all major credit cards, wire transfers, and can arrange custom payment terms for enterprise clients.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Is there a setup fee?
                </h3>
                <p className="text-gray-300">
                  No, there are no hidden fees. You only pay the advertised price for your chosen plan.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
} 