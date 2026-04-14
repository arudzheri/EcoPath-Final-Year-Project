import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, MapPin, BarChart3, ArrowRight, TreePine, Globe2, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <img src={heroBg} alt="Sustainable travel landscape" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-primary/30">
              <TreePine className="h-4 w-4" />
              Sustainable Travel Planning
            </div>
            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6">
              Travel with a<br />
              <span className="text-primary">lighter footprint</span>
            </h1>
            <p className="text-white/75 text-lg md:text-xl mb-10 font-body leading-relaxed max-w-lg">
              Compare carbon emissions across transport modes, discover eco-friendly destinations, and plan trips that respect the planet.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/find"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-lg font-heading font-semibold text-base hover:brightness-110 transition-all shadow-lg shadow-primary/25"
              >
                Plan a Trip <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/manage"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-lg font-heading font-semibold text-base hover:bg-white/20 transition-all border border-white/20"
              >
                My Itineraries
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              How <span className="text-primary">ecopath</span> works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three simple steps to plan a sustainable journey across Europe.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                step: "01",
                title: "Choose Your Route",
                desc: "Select start and end cities. We calculate the straight-line distance using the Haversine formula.",
              },
              {
                icon: BarChart3,
                step: "02",
                title: "Compare Emissions",
                desc: "See CO₂ output for car, bus, train, plane, bicycle and walking — side by side.",
              },
              {
                icon: Globe2,
                step: "03",
                title: "Explore & Save",
                desc: "View your route on the map, discover nearby attractions, get a sustainability grade, and save your itinerary.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative bg-card border border-border rounded-xl p-8 hover:shadow-lg hover:shadow-primary/5 transition-shadow"
              >
                <span className="font-heading text-5xl font-bold text-primary/10 absolute top-4 right-6">{item.step}</span>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground font-body text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-secondary">
        <div className="max-w-3xl mx-auto text-center">
          <Leaf className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ready to travel sustainably?</h2>
          <p className="text-muted-foreground mb-8">
            Every journey matters. Start planning your next eco-friendly trip today.
          </p>
          <Link
            to="/find"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-heading font-semibold hover:brightness-110 transition-all"
          >
            Get Started <Zap className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
