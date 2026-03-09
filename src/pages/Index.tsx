import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, MapPin, BarChart3, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Sustainable travel landscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-eco-dark/50" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <h1 className="font-heading text-5xl md:text-7xl font-black text-primary-foreground mb-6 leading-tight">
            Visit <span className="text-primary">EcoPath</span>
          </h1>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-8 font-body">
            Plan your travels sustainably. Compare carbon emissions across transport modes and discover eco-friendly destinations.
          </p>
          <Link
            to="/find"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-heading font-bold text-lg hover:brightness-110 transition-all"
          >
            Find Itineraries <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </section>

      {/* What is EcoPath */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div className="w-16 h-1 bg-primary mb-6" />
            <h2 className="font-heading text-4xl font-black text-foreground mb-6">
              What is <span className="text-primary">EcoPath</span>?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
              EcoPath is a sustainable travel itinerary planner that helps you make environmentally responsible travel decisions. 
              It calculates the carbon footprint of your trips, compares transport modes, and suggests eco-friendly destinations 
              — all in one place.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: MapPin, title: "Route Planning", desc: "Enter your start and end locations to generate travel routes with distance calculations." },
              { icon: BarChart3, title: "Emission Comparison", desc: "Compare CO₂ emissions across car, bus, train, plane, bicycle and walking." },
              { icon: Leaf, title: "Eco Destinations", desc: "Discover nearby points of interest using OpenTripMap integration." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-secondary p-8 rounded-lg"
              >
                <item.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-body">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
