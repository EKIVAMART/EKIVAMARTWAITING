'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-brand-800">
      {/* Animated background elements */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-brand-600 to-brand-700 opacity-10 blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-accent-teal to-brand-600 opacity-10 blur-3xl"
            animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isMounted ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* 404 Error Code */}
          {isMounted && (
            <motion.div
              className="mb-8"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <h1 className="text-9xl font-bold bg-gradient-to-r from-brand-200 via-brand-300 to-brand-400 bg-clip-text text-transparent">
                404
              </h1>
            </motion.div>
          )}
          {!isMounted && (
            <h1 className="mb-8 text-9xl font-bold bg-gradient-to-r from-brand-200 via-brand-300 to-brand-400 bg-clip-text text-transparent">
              404
            </h1>
          )}

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl">
              Page Not Found
            </h2>
            <p className="mx-auto max-w-md text-lg text-brand-200">
              The page you're looking for doesn't exist. But don't worry, our marketplace is coming soon!
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center"
          >
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05, translateY: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-600 to-brand-500 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl"
              >
                <Home className="h-5 w-5" />
                Back to Home
              </motion.button>
            </Link>

            <motion.a
              href="#waitlist"
              whileHover={{ scale: 1.05, translateY: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 rounded-lg border border-brand-400 px-8 py-3 font-semibold text-brand-200 transition-all hover:bg-brand-400/10"
            >
              Join Waitlist
              <ArrowRight className="h-5 w-5" />
            </motion.a>
          </motion.div>

          {/* Fun message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-sm text-brand-300"
          >
            💡 Psst! While you're here, why not join our waitlist for Faflora's launch?
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
