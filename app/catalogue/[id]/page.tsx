import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Vehicle3DViewer } from '@/components/Vehicle3DViewer';
import { ArrowLeft } from 'lucide-react';
import { vehiclesData } from '@/data/vehicles';

const getVehicle = (id: string) => {
  return vehiclesData[id];
};

export default async function VehicleDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = getVehicle(id);

  if (!vehicle) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-serif text-primary mb-4">Vehicle Not Found</h1>
        <Link href="/catalogue">
          <Button>Back to Collection</Button>
        </Link>
      </div>
    );
  }

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
            <Vehicle3DViewer modelPath={vehicle.modelPath} imagePath={vehicle.imagePath} />
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-secondary/20 rounded-sm flex items-center justify-center text-muted">
                 Image 1
              </div>
              <div className="aspect-video bg-secondary/20 rounded-sm flex items-center justify-center text-muted">
                 Image 2
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div>
            <div className="mb-2">
               <span className="inline-block px-3 py-1 bg-secondary/30 text-primary text-xs tracking-widest uppercase rounded-sm mb-4">
                  {vehicle.brand}
               </span>
            </div>
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
              <Link href={`/contact?vehicle=${encodeURIComponent(vehicle.name)}`} className="w-full md:w-auto">
                <Button size="lg" className="w-full">Request Information</Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full md:w-auto">Book a Visit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
