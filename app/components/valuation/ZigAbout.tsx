import { Car, DollarSign, Settings, Shield, Info } from 'lucide-react'

interface PricingData {
  Variant_Name: string
  Off_Road_Price: string
  Road_Tax: string
  Registration_Fee: string
  Plate_No_Registration_Fee: string
  On_Road_Price: string
}

interface SpecsData {
  Variant_Name: string
  Tags: string[]
  Otr_Price: string
  Specs: {
    Dimensions_Capacity?: Record<string, string>
    Engine_Details?: Record<string, string>
    Performance?: Record<string, string>
    Steering?: Record<string, string>
    Suspension_Brakes?: Record<string, string>
    Transmission?: Record<string, string>
    Wheel_Tyre?: Record<string, string>
  }
}

interface FeaturesData {
  Variant_Name: string
  Tags: string[]
  Otr_Price: string
  Features: {
    Comfort_Convenience?: Record<string, string>
    Entertainment_Communication?: Record<string, string>
    Instrumentation?: Record<string, string>
    Seats_Upholstery?: Record<string, string>
    Exterior?: Record<string, string>
    Interior?: Record<string, string>
    Safety?: Record<string, string>
    Security?: Record<string, string>
  }
}

interface AboutData {
  model_name: string
  description: string
  price_range: string
  pros: string[]
  cons: string[]
  variants: string[]
}

interface ZigWheelsDisplayProps {
  about?: AboutData
  pricing?: PricingData[]
  specifications?: SpecsData[]
  features?: FeaturesData[]
  make?: string
  model?: string
}

function formatLabel(str: string): string {
  return str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function AboutSection({ about }: { about: AboutData }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl p-6 border border-blue-200">
      <div className="flex items-start gap-3 mb-4">
        <Info className="w-6 h-6 text-blue-600 mt-1" />
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{about.model_name}</h3>
          <p className="text-lg font-semibold text-blue-600 mt-1">{about.price_range}</p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4 leading-relaxed">{about.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {about.pros.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <span className="text-lg">✓</span> Pros
            </h4>
            <ul className="space-y-1">
              {about.pros.map((pro, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {about.cons.length > 0 && (
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
              <span className="text-lg">✗</span> Cons
            </h4>
            <ul className="space-y-1">
              {about.cons.map((con, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function PricingSection({ pricing }: { pricing: PricingData[] }) {
  return (

    // Pricing

    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-600" />
        Pricing Information
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pricing.map((variant, idx) => (
          <div key={idx} className="bg-brand-white rounded-3xl border border-foreground/20 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4">
              <h4 className="font-bold text-white">{variant.Variant_Name}</h4>
              <p className="text-2xl font-bold text-white mt-1">{variant.On_Road_Price}</p>
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-foreground/20">
                <span className="text-sm text-gray-600">Off-Road Price</span>
                <span className="font-semibold text-gray-900">{variant.Off_Road_Price}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-foreground/20">
                <span className="text-sm text-gray-600">Road Tax</span>
                <span className="font-semibold text-gray-900">{variant.Road_Tax}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-foreground/20">
                <span className="text-sm text-gray-600">Registration Fee</span>
                <span className="font-semibold text-gray-900">{variant.Registration_Fee}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Plate Registration</span>
                <span className="font-semibold text-gray-900">{variant.Plate_No_Registration_Fee}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SpecificationsSection({ specifications }: { specifications: SpecsData[] }) {
  return (

    // Technical specifications

    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-600" />
        Technical Specifications
      </h3>
      
      {specifications.map((variant, idx) => (
        <div key={idx} className="bg-brand-white rounded-3xl border border-foreground/20 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
            <h4 className="font-bold text-white text-lg">{variant.Variant_Name}</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {variant.Tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-brand-white/20 rounded text-xs text-brand-white">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-white font-semibold mt-2">{variant.Otr_Price}</p>
          </div>
          
          <div className="p-4 space-y-4">
            {Object.entries(variant.Specs).map(([category, specs]) => 
              specs && Object.keys(specs).length > 0 && (
                <div key={category}>
                  <h5 className="font-semibold text-foreground mb-2 text-sm uppercase tracking-wide">
                    {formatLabel(category)}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-start bg-gray-50 rounded p-2">
                        <span className="text-xs text-foreground/50 mr-2">{formatLabel(key)}:</span>
                        <span className="text-xs font-medium text-foreground text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function FeaturesSection({ features }: { features: FeaturesData[] }) {
  return (
    // Features and equipment section
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Shield className="w-5 h-5 text-purple-600" />
        Features & Equipment
      </h3>
      
      {features.map((variant, idx) => (
        <div key={idx} className="bg-brand-white rounded-3xl border border-foreground/20 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
            <h4 className="font-bold text-white text-lg">{variant.Variant_Name}</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {variant.Tags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs text-white">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-white font-semibold mt-2">{variant.Otr_Price}</p>
          </div>
          
          <div className="p-4 space-y-4">
            {Object.entries(variant.Features).map(([category, feats]) => 
              feats && Object.keys(feats).length > 0 && (
                <div key={category}>
                  <h5 className="font-semibold text-gray-900 mb-2 text-sm uppercase tracking-wide">
                    {formatLabel(category)}
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(feats).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 bg-purple-50 rounded p-2">
                        <span className={`w-2 h-2 rounded-full ${
                          value.toLowerCase() === 'yes' || value === '✓' 
                            ? 'bg-green-500' 
                            : value.toLowerCase() === 'no' || value === '✗'
                            ? 'bg-red-500'
                            : 'bg-blue-500'
                        }`} />
                        <span className="text-xs text-gray-700 flex-1">{formatLabel(key)}</span>
                        <span className="text-xs font-medium text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ZigWheelsDisplay({ about, pricing, specifications, features, make, model }: ZigWheelsDisplayProps) {
  if (!about && !pricing && !specifications && !features) {
    return (
      <div className="rounded-xl border border-dashed border-foreground/30 p-8 text-center">
        <Car className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">No vehicle data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {about && <AboutSection about={about} />}
      {pricing && pricing.length > 0 && <PricingSection pricing={pricing} />}
      {specifications && specifications.length > 0 && <SpecificationsSection specifications={specifications} />}
      {features && features.length > 0 && <FeaturesSection features={features} />}
    </div>
  )
}