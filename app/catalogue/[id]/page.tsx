import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { ArrowLeft } from 'lucide-react';
import bikesJson from '@/bikes_data/bikes.json';

type Bike = {
  name: string;
  cc: number;
  brand: string;
  specification: string;
  type: string;
  image?: {
    localPath: string;
  };
};

const rawBikes = bikesJson as Bike[];

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const getBikeBySlug = (slug: string) =>
  rawBikes.find((bike) => slugify(bike.name) === slug);

export default async function BikeDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bike = getBikeBySlug(id);

  if (!bike) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-serif text-primary mb-4">Bike Not Found</h1>
        <Link href="/catalogue">
          <Button>Back to Collection</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <Link
            href="/catalogue"
            className="text-sm uppercase tracking-widest text-muted hover:text-primary transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={14} /> Back to Collection
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="space-y-8">
            <div className="aspect-[16/10] bg-secondary/10 overflow-hidden flex items-center justify-center">
              {bike.image?.localPath && (
                <img
                  src={bike.image.localPath}
                  alt={bike.name}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          <div>
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-secondary/30 text-primary text-xs tracking-widest uppercase rounded-sm mb-4">
                {bike.brand}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-primary mb-4">
              {bike.name}
            </h1>
            <p className="text-lg md:text-xl text-muted font-light mb-4">
              {bike.cc} cc · {bike.type}
            </p>
            <p className="text-base text-muted mb-8 whitespace-pre-line">
              {bike.specification}
            </p>

            <div className="mb-10">
              <p className="text-sm uppercase tracking-widest text-muted mb-2">
                Price & Enquiries
              </p>
              <p className="text-base text-muted mb-4">
                For up-to-date pricing and availability, reach us directly on
                WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/923222033399?text=${encodeURIComponent(
                    `Hi, I'm interested in ${bike.name} (${bike.cc}cc ${bike.brand}). Please share price and details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto"
                >
                  <Button size="lg" className="w-full">
                    WhatsApp for Price
                  </Button>
                </a>
                <Link
                  href={`/contact?vehicle=${encodeURIComponent(bike.name)}`}
                  className="w-full md:w-auto"
                >
                  <Button variant="outline" size="lg" className="w-full">
                    Request Callback
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
