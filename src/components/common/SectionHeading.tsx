import React from "react";
import { motion } from "motion/react";

const SectionHeading = ({
  children,
  subtitle,
  align = "left",
}: {
  children: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}) => (
  <div
    className={`mb-16 md:mb-24 ${align === "center" ? "text-center flex flex-col items-center" : ""}`}
  >
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-orange-400 font-mono text-sm tracking-widest uppercase mb-4"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight"
    >
      {children}
    </motion.h2>
  </div>
);

export default SectionHeading;
