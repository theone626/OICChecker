import { Card } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-purple-900 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">About Verified Tax Resolution</h1>
          
          <div className="space-y-4">
            <p className="text-lg">
              We specialize in helping taxpayers understand and navigate the IRS Offer in Compromise program. 
              Our expertise helps individuals and businesses determine their eligibility and pursue the best 
              tax resolution strategy for their situation.
            </p>

            <h2 className="text-2xl font-semibold mt-6">Our Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>IRS Offer in Compromise Evaluation</li>
              <li>Tax Resolution Strategy</li>
              <li>Professional Tax Consultation</li>
              <li>IRS Representation</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
            <p className="text-lg">
              For professional tax resolution services, contact us at:{" "}
              <a href="mailto:demetrichambers.ea@gmail.com" className="text-purple-600 hover:text-purple-800">
                demetrichambers.ea@gmail.com
              </a>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
} 