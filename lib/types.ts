export type OrderStatus = 'pending' | 'processing' | 'completed'

export interface Order {
  id: string
  vin: string
  email: string
  full_name: string
  phone: string
  package_name: string
  package_price: number
  status: OrderStatus
  report_url: string | null
  created_at: string
  updated_at: string
}

export const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49.99,
    delivery: '2–4 hours',
    features: [
      'VIN Decoder',
      'Basic Vehicle Specifications',
      'Theft Records Check',
      'Registration History',
      'Mileage Verification',
      'Email Delivery',
      'Customer Support',
    ],
    highlight: false,
  },
  {
    id: 'essential',
    name: 'Essential',
    price: 54.99,
    delivery: '1–2 hours',
    features: [
      'Everything in Starter, plus:',
      'Full Accident History',
      'Service & Maintenance Records',
      'Market Valuation',
      'Import/Export Records',
      'Fleet History Check',
      'Technical Specifications',
      'Recall Information',
      'Priority Support',
    ],
    highlight: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 59.99,
    delivery: '1–2 hours',
    features: [
      'Everything in Essential, plus:',
      'Full Accident History',
      'Service & Maintenance Records',
      'Market Valuation',
      'Import/Export Records',
      'Fleet History Check',
      'Technical Specifications',
      'Recall Information',
      'Priority Support',
    ],
    highlight: false,
  },
]

export const FAQ_ITEMS = [
  {
    q: 'What is a VIN?',
    a: 'A Vehicle Identification Number (VIN) is a unique 17-character code assigned to a vehicle by its manufacturer. It identifies the vehicle and can provide details such as the manufacturer, vehicle type, model year, production information, and unique serial number.',
  },
  {
    q: 'Where can I find my VIN?',
    a: "Your VIN can be found on the lower corner of your windshield (driver's side), on the driver's doorframe sticker, under the hood on the firewall, or on your registration, title, and insurance documents.",
  },
  {
    q: 'What can a VIN check tell me about a vehicle?',
    a: 'A VIN check can reveal accident history, title brands (salvage, flood, rebuilt), odometer readings, theft records, previous owners, service events, and open recalls.',
  },
  {
    q: 'How long does it take to receive my report?',
    a: 'Starter reports are delivered in 2–4 hours. Essential and Professional reports are delivered in 1–2 hours after order confirmation.',
  },
  {
    q: 'How accurate is a VIN report?',
    a: 'Our reports draw from 100+ trusted data sources including DMV records, insurance carriers, auction houses, and manufacturer databases. Accuracy depends on what has been officially reported.',
  },
  {
    q: 'Can I check any vehicle with a VIN?',
    a: 'Yes. Any vehicle with a standard 17-character VIN — cars, trucks, SUVs, motorcycles, and more — can be checked.',
  },
  {
    q: 'Do I need to buy the vehicle before checking its VIN?',
    a: 'No. We encourage you to check a VIN before making any purchase decision.',
  },
  {
    q: 'What happens if my VIN report contains a problem?',
    a: 'The report will clearly flag any issues found. You can use this information to negotiate, request repairs, or walk away from the deal entirely.',
  },
  {
    q: 'Can a VIN report guarantee that a vehicle has never been damaged or involved in an accident?',
    a: 'No. A VIN report only shows what has been officially reported. Unreported incidents will not appear in the data.',
  },
  {
    q: 'What if I enter the wrong VIN?',
    a: 'Contact our support team within 24 hours and we will run the correct VIN at no additional charge.',
  },
]
