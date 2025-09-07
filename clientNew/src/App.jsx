import Layout from './components/layout/Layout';
import Hero from './components/landing/Hero';
import About from './components/landing/About';
import Services from './components/landing/Services';
import Clients from './components/landing/Clients';
import Contact from './components/landing/Contact';

function App() {
  return (
    <Layout>
      <Hero />
      <About />
      <Services />
      <Clients />
      <Contact />
    </Layout>
  );
}

export default App;