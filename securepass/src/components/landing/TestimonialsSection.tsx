import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Kimani',
    role: 'Facility Manager',
    company: 'TechHub Nairobi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    content: 'SecurePass replaced our paper logbooks overnight. Check-in time dropped from 5 minutes to 30 seconds. Our visitors constantly compliment the modern experience.',
    rating: 5,
  },
  {
    name: 'James Ochieng',
    role: 'Security Director',
    company: 'KenGen Towers',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    content: 'The watchlist screening and real-time alerts have completely transformed our security posture. We reduced incidents by 85% in the first quarter.',
    rating: 5,
  },
  {
    name: 'Dr. Amina Hassan',
    role: 'Hospital Administrator',
    company: 'Aga Khan Hospital',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120',
    content: 'Managing patient visitors in a healthcare setting requires strict compliance. SecurePass gave us the audit trails and access control we needed.',
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [active, setActive] = useState(0);

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <button
            onClick={() =>
              setActive((p) => (p - 1 + testimonials.length) % testimonials.length)
            }
            className="absolute left-0 lg:-left-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 border border-gray-100"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() =>
              setActive((p) => (p + 1) % testimonials.length)
            }
            className="absolute right-0 lg:-right-14 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 border border-gray-100"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl border border-gray-100 relative"
          >
            <Quote className="absolute top-8 right-8 w-10 h-10 text-emerald-100" />

            <div className="flex space-x-0.5 mb-6">
              {[...Array(testimonials[active].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
              ))}
            </div>

            <p className="text-gray-700 text-lg lg:text-xl leading-relaxed mb-8 font-medium italic">
              "{testimonials[active].content}"
            </p>

            <div className="flex items-center space-x-4">
              <img
                src={testimonials[active].avatar}
                alt={testimonials[active].name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-bold text-gray-900">
                  {testimonials[active].name}
                </p>
                <p className="text-sm text-gray-500">
                  {testimonials[active].role}, {testimonials[active].company}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all ${
                  i === active
                    ? 'w-8 h-2.5 bg-emerald-500'
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;