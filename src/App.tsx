import Hero from './components/Hero';
import ScrollVideo from './components/ScrollVideo';
import Timeline from './components/Timeline';
import QuoteTransition from './components/QuoteTransition';
import Footer from './components/Footer';

function App() {
  return (
    <main className="bg-black min-h-screen">
      <Hero />
      <Timeline />
      <QuoteTransition />
      <ScrollVideo />
      <Footer />
    </main>   
  );
}

export default App;
