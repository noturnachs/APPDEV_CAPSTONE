import { motion } from 'framer-motion';

const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  direction = 'up', 
  className = '', 
  ...props 
}) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
      x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      x: 0 
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

export default FadeIn;
