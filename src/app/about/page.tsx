import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'
import missionImage from '../../../public/mission-photo.jpg'
// Import team member images
import sarahImage from '../../../public/team/gasore (2).jpg'
import michaelImage from '../../../public/team/claire.jpg'
import emmaImage from '../../../public/team/siboniyo.jpg'
import { StaticImageData } from 'next/image'

// Team member interface
interface TeamMember {
  id: number
  name: string
  position: string
  image: StaticImageData
}

// Team members data using imported images
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "GASORE NSHUTI Moise",
    position: "Chief Executive Officer",
    image: sarahImage
  },
  {
    id: 2,
    name: "Marie Claire UWIRINGIYIMANA",
    position: "Chief Technology Officer",
    image: michaelImage
  },
  {
    id: 3,
    name: "Emmanuel SIBONIYO",
    position: "Chief Financial Officer",
    image: emmaImage
  }
]

export default function About() {
  return (
    <Layout>
      <main className="min-h-screen bg-gray-900">
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              About Optical Eyewear
            </h1>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Revolutionizing the optical industry through innovative B2B solutions
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-6 bg-gray-800/50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={missionImage}
                alt="Our mission visualization"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-gray-300 mb-6">
                We're on a mission to transform how optical businesses operate by creating 
                seamless connections between manufacturers, suppliers, and retailers.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Streamlining supply chain operations
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Enhancing product accessibility
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Improving business efficiency
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-white text-center">
              Our Leadership Team
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.id} className="text-center">
                  <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden relative">
                    <Image
                      src={member.image}
                      alt={`${member.name} - ${member.position}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {member.name}
                  </h3>
                  <p className="text-gray-400">{member.position}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-gray-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Join Our Network
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Be part of the future of optical retail. Join our growing network of 
              suppliers and retailers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register/supplier"
                className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Become a Supplier
              </Link>
              <Link
                href="/auth/register/buyer"
                className="bg-gray-800 text-white px-8 py-3 rounded-full hover:bg-gray-700 transition-colors"
              >
                Register as Buyer
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
} 