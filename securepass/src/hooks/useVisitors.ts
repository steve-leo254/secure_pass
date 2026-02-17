import { useState, useEffect } from 'react';
import type { Visitor } from '../types';

export const useVisitors = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);

  // Load visitors from localStorage on mount
  useEffect(() => {
    const storedVisitors = localStorage.getItem('visitors');
    if (storedVisitors) {
      setVisitors(JSON.parse(storedVisitors));
    }
  }, []);

  // Save visitors to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('visitors', JSON.stringify(visitors));
  }, [visitors]);

  const addVisitor = (visitorData: Omit<Visitor, 'id' | 'timeIn' | 'timeOut'>) => {
    const newVisitor: Visitor = {
      ...visitorData,
      id: Date.now().toString(),
      timeIn: new Date().toISOString(),
      timeOut: null,
    };
    setVisitors(prev => [...prev, newVisitor]);
  };

  const checkoutVisitor = (id: string) => {
    setVisitors(prev =>
      prev.map(visitor =>
        visitor.id === id
          ? { ...visitor, timeOut: new Date().toISOString() }
          : visitor
      )
    );
  };

  const deleteVisitor = (id: string) => {
    setVisitors(prev => prev.filter(visitor => visitor.id !== id));
  };

  const activeVisitors = visitors.filter(visitor => !visitor.timeOut);

  return {
    visitors,
    activeVisitors,
    addVisitor,
    checkoutVisitor,
    deleteVisitor,
  };
};
