import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Vehicle3DViewer } from '@/components/Vehicle3DViewer';
import { ArrowLeft, Check } from 'lucide-react';

// Mock Data Function
const vehiclesData: Record<string, any> = {
  '1': {
    name: 'Kawasaki Ninja 400',
    tagline: 'Track Born, Street Bred',
    price: 'PKR 18.5 Lac',
    description: 'The Kawasaki Ninja 400 offers the perfect balance of everyday riding and sport performance. With a 399cc twin-cylinder engine, it delivers smooth power and responsive handling, making it the ideal choice for both new riders and experienced enthusiasts.',
    specs: [
      { label: 'Engine', value: '399cc Liquid-Cooled Twin' },
      { label: 'Power', value: '49 HP' },
      { label: 'Torque', value: '38 Nm' },
      { label: 'Weight', value: '168 kg' },
      { label: 'Seat Height', value: '785 mm' },
      { label: 'Fuel Capacity', value: '14 L' },
    ]
  },
  '2': {
    name: 'Ducati Panigale V4',
    tagline: 'The Science of Speed',
    price: 'PKR 85.0 Lac',
    description: 'A symphony of Italian engineering and design. The Panigale V4 is the closest thing to a MotoGP bike for the road, featuring advanced electronics, aerodynamics, and the Desmosedici Stradale engine.',
    specs: [
      { label: 'Engine', value: '1103cc Desmosedici Stradale V4' },
      { label: 'Power', value: '214 HP' },
      { label: 'Torque', value: '124 Nm' },
      { label: 'Weight', value: '175 kg' },
      { label: 'Top Speed', value: '299+ km/h' },
      { label: 'Technology', value: 'DTC, DWC, DSC, EBC' },
    ]
  },
  '3': {
    name: 'BMW S1000RR',
    tagline: 'Adrenaline Redefined',
    price: 'PKR 75.0 Lac',
    description: 'The BMW S1000RR is a superbike that sets benchmarks. With ShiftCam technology, it offers power across the entire rev range, ensuring you are always ahead of the curve.',
    specs: [
      { label: 'Engine', value: '999cc Inline-4' },
      { label: 'Power', value: '207 HP' },
      { label: '0-100 km/h', value: '3.1s' },
      { label: 'Weight', value: '197 kg' },
      { label: 'Modes', value: 'Rain, Road, Dynamic, Race' },
      { label: 'Brakes', value: 'M Brakes' },
    ]
  },
   '4': {
    name: 'Yamaha R1M',
    tagline: 'MotoGP Technology',
    price: 'PKR 68.0 Lac',
    description: 'Developed with technology from the YZR-M1 MotoGP machine, the R1M is the ultimate track weapon. Featuring Öhlins Electronic Racing Suspension and carbon bodywork.',
    specs: [
      { label: 'Engine', value: '998cc CP4 Inline-4' },
      { label: 'Power', value: '200 HP' },
      { label: 'Suspension', value: 'Öhlins ERS' },
      { label: 'Bodywork', value: 'Carbon Fiber' },
      { label: 'Electronics', value: '6-axis IMU' },
    ]
  },
  '5': {
    name: 'Suzuki Hayabusa',
    tagline: 'The Ultimate Sportbike',
    price: 'PKR 55.0 Lac',
    description: 'Legendary power and aerodynamic efficiency. The Hayabusa is known for its overwhelming torque and comfortable high-speed touring capabilities.',
    specs: [
      { label: 'Engine', value: '1340cc Inline-4' },
      { label: 'Power', value: '190 HP' },
      { label: 'Torque', value: '150 Nm' },
      { label: 'Weight', value: '264 kg' },
      { label: 'Top Speed', value: '299 km/h (Limited)' },
    ]
  },
  '6': {
    name: 'OW Electric Scooter',
    tagline: 'Urban Mobility',
    price: 'PKR 3.5 Lac',
    description: 'Eco-friendly, silent, and stylish. The OW Electric Scooter is perfect for navigating the city streets of Lahore with ease and zero emissions.',
    specs: [
      { label: 'Motor', value: '1200W Brushless' },
      { label: 'Range', value: '80 km' },
      { label: 'Top Speed', value: '60 km/h' },
      { label: 'Battery', value: '72V Lithium-ion' },
      { label: 'Charging', value: '4-6 Hours' },
    ]
  }
};

const getVehicle = (id: string) => {
  return vehiclesData[id] || vehiclesData['1'];
};

export default async function VehicleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicle(id);

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Back Link */}
        <div className="mb-8">
           <Link href="/catalogue" className="text-sm uppercase tracking-widest text-muted hover:text-primary transition-colors flex items-center gap-2">
             <ArrowLeft size={14} /> Back to Collection
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          
          {/* Left Column: Visuals */}
          <div className="space-y-8">
            <Vehicle3DViewer />
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-secondary/20 rounded-sm" />
              <div className="aspect-video bg-secondary/20 rounded-sm" />
            </div>
          </div>

          {/* Right Column: Details */}
          <div>
             <h1 className="text-3xl md:text-5xl font-serif text-primary mb-2">{vehicle.name}</h1>
             <p className="text-lg md:text-xl text-accent font-light mb-6">{vehicle.tagline}</p>
             <p className="text-2xl md:text-3xl text-primary font-medium mb-8">{vehicle.price}</p>
             
             <div className="prose prose-lg text-muted mb-12 font-light leading-relaxed">
               {vehicle.description}
             </div>

             <div className="mb-12">
               <h3 className="text-lg font-serif text-primary mb-6 border-b border-secondary pb-2">Specifications</h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                 {vehicle.specs.map((spec, index) => (
                   <div key={index} className="flex justify-between items-center border-b border-secondary/30 pb-2">
                     <span className="text-sm uppercase tracking-wider text-muted">{spec.label}</span>
                     <span className="font-medium text-primary text-right">{spec.value}</span>
                   </div>
                 ))}
               </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4">
               <Link href="/contact" className="w-full md:w-auto">
                 <Button size="lg" className="w-full">Request Information</Button>
               </Link>
               <Button variant="outline" size="lg" className="w-full md:w-auto">Download Brochure</Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
