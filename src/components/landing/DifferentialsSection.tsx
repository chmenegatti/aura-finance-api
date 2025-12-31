import { motion } from "framer-motion";
import { Sparkles, Eye, Lock, Zap } from "lucide-react";

const differentials = [
  {
    icon: Sparkles,
    title: "Design Moderno e Intuitivo",
    description: "Interface clean e contemporânea que torna a gestão financeira uma experiência agradável."
  },
  {
    icon: Eye,
    title: "Foco em Clareza",
    description: "Informações apresentadas de forma visual e fácil de entender, sem complicações."
  },
  {
    icon: Lock,
    title: "Dados Organizados e Seguros",
    description: "Suas informações financeiras protegidas com os mais altos padrões de segurança."
  },
  {
    icon: Zap,
    title: "Experiência Fluida",
    description: "Performance otimizada para funcionar perfeitamente em qualquer dispositivo."
  }
];

export const DifferentialsSection = () => {
  return (
    <section id="diferenciais" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-4">
            Diferenciais
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que escolher o{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              MyFinance?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Desenvolvido com foco total na experiência do usuário.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {differentials.map((diff, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-colors duration-300">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <diff.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {diff.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {diff.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
