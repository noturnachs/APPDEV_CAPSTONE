import { CheckCircle, Target, Eye, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description:
        'To provide innovative environmental solutions that protect our planet while enabling sustainable business growth.',
    },
    {
      icon: Eye,
      title: 'Our Vision',
      description:
        'A world where environmental stewardship and economic prosperity go hand in hand for a sustainable future.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      description:
        'Integrity, innovation, and environmental responsibility guide everything we do in our consulting practice.',
    },
  ];

  const achievements = [
    '30+ years of environmental consulting expertise in Cebu',
    'Certified environmental professionals and engineers',
    'Trusted partner of Cebu\'s leading industry players',
    'Expert in Philippine environmental regulations and compliance',
    'Proven track record in environmental management systems',
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.25, 0.25, 1] }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            About Alpha Environmental Systems
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.25, 0.25, 1] }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Established by Engr. Alex Eslawan, the firm has been serving Cebu's industry leaders since 1994. We ensure companies follow regulations set by the Philippines to keep a healthy and livable environment.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.25, 0.25, 1] }}
          >
            <img
              src="/images/illustrations/quote3.svg"
              alt="Environmental scientists at work"
              className="rounded-2xl shadow-lg w-full h-auto"
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.25, 0.25, 1] }}
            className="space-y-6"
          >
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.25, 0.25, 1] }}
              className="text-2xl font-bold text-gray-900"
            >
              Pioneering Environmental Excellence Since 1994
            </motion.h3>
            <p className="text-gray-600 leading-relaxed">
              Founded by Engr. Alex Eslawan, Alpha Environmental Systems Corporation has been at the forefront of environmental consulting in Cebu for over three decades, helping organizations navigate complex environmental challenges while achieving regulatory compliance.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our team of certified environmental professionals combines deep knowledge of Philippine environmental regulations with practical business solutions to deliver measurable results for our clients across various industries in Cebu and beyond.
            </p>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.5 + (0.1 * index), ease: [0.25, 0.25, 0.25, 1] }}
                  className="flex items-start space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{achievement}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 * index, ease: [0.25, 0.25, 0.25, 1] }}
              className="text-center p-8 rounded-xl bg-gray-50 hover:bg-primary/5 transition-colors duration-300"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h4>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
