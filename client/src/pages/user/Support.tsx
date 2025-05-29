import React from 'react';
import Footer from '../../components/Footer';

const Support: React.FC = () => {
  return (
    <div className="w-full">
      <section className="max-w-3xl mx-auto px-6 py-20 text-left leading-relaxed font-light">
        <h2 className="text-4xl font-semibold mb-8 tracking-tight text-black">
          Get in Touch - Contact Us
        </h2>

        <p className="text-gray-700 mb-5">
          You can reach out to us on{' '}
          <a href="mailto:support@hackcloth.in" className="text-600 underline">
            support@hackcloth.in
          </a>
          , we are almost always online, and will respond as soon as we can.
        </p>

        <p className="text-gray-700 mb-5">
          If you're here, it probably means you're either a fan of our hacking
          clothing brand, or you're trying to hack into our website. Either way,
          we're happy you're here!
        </p>

        <p className="text-gray-700 mb-5">
          If you have a question about our products, want to chat about the
          latest hacking trends, or just want to say hello, please feel free to
          drop us a line. We promise not to hack your email (unless you ask us
          to, of course).
        </p>

        <p className="italic text-gray-700 mb-5">
          And finally, if you're a hacker trying to infiltrate our system,{' '}
          <strong>please don't</strong>.
        </p>

        <p className="text-gray-700">
          Thanks for visiting our website, and we look forward to hearing from
          you (especially if you're not a hacker).
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Support;
