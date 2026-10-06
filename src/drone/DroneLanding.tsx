import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import DroneNav from '@/drone/DroneNav';

export default function DroneLanding() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Aerial Cinematography — Drone Work | Jefney Ongeri</title>
        <meta name="description" content="Iowa drone videography and photography by Jefney Ongeri — real estate, weddings, rooftop and landscape aerials in Waterloo, Cedar Falls and statewide." />
        <link rel="canonical" href="https://jeffongeri.com/drone" />
      </Helmet>
      <Header />
      <DroneNav />
      <main id="main-content">
        <iframe src="/embeds/drone/landing.html" title="Jefney Ongeri — Aerial Cinematography" className="block h-[calc(100vh-7rem)] min-h-[40rem] w-full border-0" />
      </main>
    </div>
  );
}
