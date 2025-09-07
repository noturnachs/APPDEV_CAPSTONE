import BlurIn from '../../components/ui/BlurIn';
import FadeIn from '../../components/ui/FadeIn';
import { Card, CardContent } from '../../components/ui/Card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact = () => {
  // possible contact information changes in the future
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Office Location',
      details: ['The Persimmon Condominium - Tower 3', 'Cebu City, Philippines'],
    },
    {
      icon: Phone,
      title: 'Phone Numbers',
      details: ['09494782611 - Viber/Wechat', '09061228371 - Viber', '(032) 513-5081 - Landline'],
    },
    {
      icon: Mail,
      title: 'Email Addresses',
      details: ['admin@alphaenvi.onmicrosoft.com', 'Engrann@alphaenvi.onmicrosoft.com'],
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Monday - Friday: 8:00 AM - 5:00 PM', 'Saturday: 9:00 AM - 12:00 PM', 'Sunday: Closed'],
    },
  ];

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <BlurIn className="text-3xl md:text-4xl font-bold text-gray-900 mb-4" duration={1}>
            <h2>Get In Touch With Our Experts</h2>
          </BlurIn>
          <FadeIn delay={0.3}>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Contact our team of certified professionals for a consultation tailored to your specific environmental
              consulting needs.
            </p>
          </FadeIn>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {contactInfo.map((info, index) => (
            <FadeIn key={index} delay={0.2 * index}>
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 h-full bg-white border-gray-200">
                <CardContent className="p-6 lg:p-8 text-center flex flex-col h-full">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 lg:mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <info.icon className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-3 lg:mb-4 text-base lg:text-lg">{info.title}</h4>
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    {info.details.map((detail, detailIndex) => (
                      <p 
                        key={detailIndex} 
                        className={`text-gray-600 leading-relaxed ${
                          info.title === 'Email Addresses' 
                            ? 'text-xs sm:text-sm break-all' 
                            : 'text-sm'
                        }`}
                        style={{
                          wordBreak: info.title === 'Email Addresses' ? 'break-all' : 'normal',
                          hyphens: info.title === 'Email Addresses' ? 'auto' : 'none'
                        }}
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
