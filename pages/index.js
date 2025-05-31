import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

export default function OICEligibilityPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    income: '3000',
    expenses: '2800',
    assets: '4000',
    debts: '5000',
    householdSize: '3',
    employer: 'ABC Corp',
    jobTitle: 'Delivery Driver',
    payFrequency: 'Monthly',
    housingCost: '1200',
    transportationCost: '300',
    medicalExpenses: '150',
    otherExpenses: '200',
    bankAccounts: 'Checking: $500\nSavings: $1,000',
    vehicles: '2013 Honda Accord, est. equity $1,500',
    realEstate: 'None',
    email: ''
  });

  const [qualified, setQualified] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleNext = () => {
    if (step === 9) {
      const isQualified = calculateEligibility();
      setQualified(isQualified);
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (!formData.email) return alert("Please enter your email to proceed.");
    try {
      await fetch('/api/send-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, qualified })
      });
    } catch {
      alert('There was a problem sending your guide.');
      return;
    }
    setStep(11);
  };

  const calculateEligibility = () => {
    const i = parseFloat(formData.income) || 0;
    const e = parseFloat(formData.expenses) || 0;
    const a = parseFloat(formData.assets) || 0;
    const d = parseFloat(formData.debts) || 0;
    const disposable = i - e;
    const rcPotential = disposable * 12 + a - d;
    return rcPotential < 5000;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gradient-to-b from-purple-800 to-purple-500 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4 text-center">IRS Offer in Compromise Checker</h1>
      <p className="mb-6 text-center text-purple-100">Walk through Form 433-A (OIC) questions to check eligibility in 2 minutes.</p>
      {[1,2,3,4,5,6,7,8].includes(step) && (
        <Card className="mb-4 bg-white text-black">
          <CardContent className="p-4">
            {step === 1 && <><label>Monthly Income</label><Input type="number" value={formData.income} onChange={handleChange('income')} placeholder={formData.income} className="placeholder:text-gray-400" /></>}
            {step === 2 && <><label>Monthly Expenses</label><Input type="number" value={formData.expenses} onChange={handleChange('expenses')} placeholder={formData.expenses} className="placeholder:text-gray-400" /></>}
            {step === 3 && <><label>Assets</label><Input type="number" value={formData.assets} onChange={handleChange('assets')} placeholder={formData.assets} className="placeholder:text-gray-400" /></>}
            {step === 4 && <><label>Debts</label><Input type="number" value={formData.debts} onChange={handleChange('debts')} placeholder={formData.debts} className="placeholder:text-gray-400" /></>}
            {step === 5 && <><label>Household Size</label><Input type="number" value={formData.householdSize} onChange={handleChange('householdSize')} placeholder={formData.householdSize} className="placeholder:text-gray-400" /></>}
            {step === 6 && <><label>Employer</label><Input value={formData.employer} onChange={handleChange('employer')} placeholder={formData.employer} className="placeholder:text-gray-400 mb-2" /><label>Job Title</label><Input value={formData.jobTitle} onChange={handleChange('jobTitle')} placeholder={formData.jobTitle} className="placeholder:text-gray-400" /></>}
            {step === 7 && <><label>Monthly Housing</label><Input value={formData.housingCost} onChange={handleChange('housingCost')} placeholder={formData.housingCost} className="placeholder:text-gray-400 mb-2" /><label>Transportation</label><Input value={formData.transportationCost} onChange={handleChange('transportationCost')} placeholder={formData.transportationCost} className="placeholder:text-gray-400" /></>}
            {step === 8 && <><label>Medical</label><Input value={formData.medicalExpenses} onChange={handleChange('medicalExpenses')} placeholder={formData.medicalExpenses} className="placeholder:text-gray-400 mb-2" /><label>Other Expenses</label><Input value={formData.otherExpenses} onChange={handleChange('otherExpenses')} placeholder={formData.otherExpenses} className="placeholder:text-gray-400" /></>}
            <Button className="mt-4 w-full bg-purple-700" onClick={handleNext}>Next</Button>
          </CardContent>
        </Card>
      )}
      {step === 9 && (
        <Card className="mb-4 bg-white text-black">
          <CardContent className="p-4">
            <label>Bank Accounts</label><Textarea value={formData.bankAccounts} onChange={handleChange('bankAccounts')} placeholder={formData.bankAccounts} className="placeholder:text-gray-400 mb-2" />
            <label>Vehicles</label><Textarea value={formData.vehicles} onChange={handleChange('vehicles')} placeholder={formData.vehicles} className="placeholder:text-gray-400 mb-2" />
            <label>Real Estate</label><Textarea value={formData.realEstate} onChange={handleChange('realEstate')} placeholder={formData.realEstate} className="placeholder:text-gray-400 mb-2" />
            <Button className="mt-4 w-full bg-purple-700" onClick={handleNext}>Next</Button>
          </CardContent>
        </Card>
      )}
      {step === 10 && (
        <Card className="mb-4 bg-white text-black">
          <CardContent className="p-4">
            <h2 className={`text-2xl font-bold mb-2 ${qualified ? 'text-green-600' : 'text-red-600'}`}>
              {qualified ? '✅ You May Qualify' : '❌ You May Not Qualify'}
            </h2>
            <p className="mb-4">
              {qualified
                ? 'Based on your answers, you appear to meet the criteria for an Offer in Compromise. Would you like to receive your free copy of Our Tax Resolution Guide by email?' 
                : 'Based on your answers, it looks like you may not qualify right now. However, there are still other IRS options and planning strategies that may help you resolve your balance — Our Tax Resolution Guide will walk you through them.'}
            </p>
            <label>Email</label>
            <Input type="email" value={formData.email} onChange={handleChange('email')} placeholder="you@example.com" className="placeholder:text-gray-400 mb-4" />
            <Button className="w-full bg-purple-700" onClick={handleSubmit}>Send Me the Guide</Button>
          </CardContent>
        </Card>
      )}
      {step === 11 && (
        <Card className="mb-4 bg-white text-black">
          <CardContent className="p-4 text-center">
            <h2 className="text-green-700 text-2xl font-bold mb-2">📩 Guide Sent!</h2>
            <p>Check your inbox — your copy of Our Tax Resolution Guide is on the way.</p>
            <p className="mt-2 text-sm">Need help? Just reply to the email to schedule a consult.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
