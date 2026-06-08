const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const titleContainerVariants = {
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.4 } }
};

const charVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)", scale: 0.95 },
  show: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

// Paragraph transition adjustment inside Hero component
<motion.p 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.2 }}
  className="mt-8 text-sm md:text-lg font-light max-w-md text-white/70 leading-relaxed min-h-[80px]"
>
  {userInfo.intro}
</motion.p>