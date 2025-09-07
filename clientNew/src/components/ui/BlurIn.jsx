import { motion } from 'framer-motion';

const BlurIn = ({ 
  children, 
  delay = 0, 
  duration = 0.8, 
  className = '', 
  ...props 
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
    },
    visible: { 
      opacity: 1,
      filter: 'blur(0px)',
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={variants}
      transition={{ duration, delay, ease: [0.25, 0.25, 0.25, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default BlurIn;
