"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1d2731] to-[#0d1a26] p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full"
      >
        <h1 className="text-3xl font-bold text-center text-[#1d2731] mb-6">
          Terms and Conditions
        </h1>
        <div className="text-[#1d2731] space-y-4">
          <p>
            Welcome to Our Gaming World! These terms and conditions outline the
            rules and regulations for the use of our Website.
          </p>
          <h2 className="text-2xl font-semibold">1. Introduction</h2>
          <p>
            By accessing this website, we assume you accept these terms and
            conditions. Do not continue to use Our Gaming World if you do not
            agree to take all of the terms and conditions stated on this page.
          </p>
          <h2 className="text-2xl font-semibold">2. License</h2>
          <p>
            Unless otherwise stated, Our Gaming World and/or its licensors own
            the intellectual property rights for all material on Our Gaming
            World. All intellectual property rights are reserved. You may
            access this from Our Gaming World for your own personal use
            subjected to restrictions set in these terms and conditions.
          </p>
          <h2 className="text-2xl font-semibold">3. User Comments</h2>
          <p>
            Parts of this website offer an opportunity for users to post and
            exchange opinions and information in certain areas of the website.
            Our Gaming World does not filter, edit, publish or review Comments
            prior to their presence on the website. Comments do not reflect the
            views and opinions of Our Gaming World, its agents and/or
            affiliates. Comments reflect the views and opinions of the person
            who post their views and opinions.
          </p>
          <h2 className="text-2xl font-semibold">4. Hyperlinking to our Content</h2>
          <div>
            The following organizations may link to our Website without prior
            written approval:
            <ul className="list-disc ml-6">
              <li>Government agencies;</li>
              <li>Search engines;</li>
              <li>News organizations;</li>
              <li>
                Online directory distributors may link to our Website in the
                same manner as they hyperlink to the Websites of other listed
                businesses; and
              </li>
              <li>
                System wide Accredited Businesses except soliciting non-profit
                organizations, charity shopping malls, and charity fundraising
                groups which may not hyperlink to our Web site.
              </li>
            </ul>
          </div>
          <h2 className="text-2xl font-semibold">5. iFrames</h2>
          <p>
            Without prior approval and written permission, you may not create
            frames around our Webpages that alter in any way the visual
            presentation or appearance of our Website.
          </p>
          <h2 className="text-2xl font-semibold">6. Content Liability</h2>
          <p>
            We shall not be hold responsible for any content that appears on
            your Website. You agree to protect and defend us against all claims
            that is rising on your Website.
          </p>
          <h2 className="text-2xl font-semibold">7. Reservation of Rights</h2>
          <p>
            We reserve the right to request that you remove all links or any
            particular link to our Website. You approve to immediately remove
            all links to our Website upon request.
          </p>
          <h2 className="text-2xl font-semibold">8. Removal of links from our website</h2>
          <p>
            If you find any link on our Website that is offensive for any
            reason, you are free to contact and inform us any moment. We will
            consider requests to remove links but we are not obligated to or so
            or to respond to you directly.
          </p>
          <h2 className="text-2xl font-semibold">9. Disclaimer</h2>
          <p>
            To the maximum extent permitted by applicable law, we exclude all
            representations, warranties and conditions relating to our website
            and the use of this website.
          </p>

          <div className="text-center mt-6">
            <Link href="/" legacyBehavior>
              <a className="text-[#235789] hover:text-[#ffcb05] transition-all duration-300">
                Back to Home
              </a>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}