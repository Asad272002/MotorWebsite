'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { CheckCircle } from 'lucide-react';
import { vehiclesData } from '@/data/vehicles';

function ContactForm() {
  const searchParams = useSearchParams();
  const initialVehicle = searchParams.get('vehicle') || '';

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    vehicle: '',
    message: ''
  });

  useEffect(() => {
    if (initialVehicle) {
      setFormState(prev => ({ ...prev, vehicle: initialVehicle }));
    }
  }, [initialVehicle]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submission
    setTimeout(() => {
      setIsSubmitted(true);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white border border-secondary/30 p-6 md:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-2/3">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    value={formState.name}
                    onChange={handleChange}
                    className="w-full border-b border-secondary/50 py-2 focus:outline-none focus:border-primary transition-colors bg-transparent placeholder-muted/30"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    value={formState.email}
                    onChange={handleChange}
                    className="w-full border-b border-secondary/50 py-2 focus:outline-none focus:border-primary transition-colors bg-transparent placeholder-muted/30"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-xs uppercase tracking-widest text-muted">Phone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formState.phone}
                    onChange={handleChange}
                    className="w-full border-b border-secondary/50 py-2 focus:outline-none focus:border-primary transition-colors bg-transparent placeholder-muted/30"
                    placeholder="+92 300 ..."
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="vehicle" className="text-xs uppercase tracking-widest text-muted">Vehicle of Interest</label>
                  <select 
                    id="vehicle" 
                    name="vehicle" 
                    value={formState.vehicle}
                    onChange={handleChange}
                    className="w-full border-b border-secondary/50 py-2 focus:outline-none focus:border-primary transition-colors bg-transparent text-primary"
                  >
                    <option value="">Select a vehicle</option>
                    {Object.values(vehiclesData).map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.name}>{vehicle.name}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-xs uppercase tracking-widest text-muted">Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  rows={4}
                  required
                  value={formState.message}
                  onChange={handleChange}
                  className="w-full border-b border-secondary/50 py-2 focus:outline-none focus:border-primary transition-colors bg-transparent placeholder-muted/30 resize-none"
                  placeholder="I am interested in..."
                />
              </div>

              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full md:w-auto">
                  Send Inquiry
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <CheckCircle className="w-16 h-16 text-primary mb-6" />
              <h3 className="text-2xl font-serif text-primary mb-2">Inquiry Received</h3>
              <p className="text-muted">Thank you. Our team will contact you shortly.</p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="mt-8 text-xs uppercase tracking-widest border-b border-primary pb-1 hover:text-primary/70 transition-colors"
              >
                Send Another
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full md:w-1/3 md:border-l border-secondary/30 md:pl-12 flex flex-col justify-center space-y-8">
        <div>
          <h3 className="font-serif text-xl text-primary mb-4">Visit Us</h3>
          <p className="text-muted text-sm leading-relaxed">
            Shop#61-A, Main Peco Road Township,<br/>
            Lahore, Pakistan.
          </p>
        </div>
        <div>
          <h3 className="font-serif text-xl text-primary mb-4">Contact</h3>
          <p className="text-muted text-sm leading-relaxed">
            +92 322 2033399<br/>
            omerwaseem.97@gmail.com
          </p>
        </div>
        <div>
          <h3 className="font-serif text-xl text-primary mb-4">Follow</h3>
          <div className="flex space-x-4 text-sm text-muted">
            <a href="https://www.instagram.com/owmotors.official/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
            <a href="https://www.youtube.com/@owmotorsports" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-serif text-primary mb-4">Inquiries</h1>
          <p className="text-muted">We invite you to start a conversation.</p>
        </div>

        <Suspense fallback={<div>Loading form...</div>}>
          <ContactForm />
        </Suspense>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm text-muted">
          <div>
            <h4 className="text-primary font-medium mb-2 uppercase tracking-widest text-xs">Visit Us</h4>
            <p>Shop#61-A, Main Peco Road Township</p>
            <p>Lahore, Pakistan</p>
          </div>
          <div>
            <h4 className="text-primary font-medium mb-2 uppercase tracking-widest text-xs">Call Us</h4>
            <p>+92 322 2033399</p>
            <p>Mon - Sat: 11am - 9pm</p>
          </div>
          <div>
            <h4 className="text-primary font-medium mb-2 uppercase tracking-widest text-xs">Email</h4>
            <p>omerwaseem.97@gmail.com</p>
          </div>
        </div>

      </div>
    </div>
  );
}
