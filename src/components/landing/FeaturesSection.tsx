import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  Tags,
  RefreshCw,
  FolderOpen,
  Smartphone
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard Financeiro Inteligente",
    description: "Visão completa do seu mês com saldo, entradas, saídas e economia em tempo real. Todas as informações importantes em um único lugar.",
    image: "left"
  },
  {
    icon: BarChart3,
    title: "Relatórios e Gráficos Detalhados",
    description: "Gráficos de pizza, barras e linhas para você entender exatamente para onde seu dinheiro está indo e como ele evolui ao longo do tempo.",
    image: "right"
  },
  {
    icon: Tags,
    title: "Categorias Personalizadas",
    description: "Crie e customize suas próprias categorias de gastos. Organize suas despesas do jeito que faz mais sentido para você.",
    image: "left"
  },
  {
    icon: RefreshCw,
    title: "Gastos Recorrentes Automatizados",
    description: "Configure uma vez seus financiamentos, empréstimos e assinaturas. O app lembra de tudo e mostra seus compromissos futuros.",
    image: "right"
  },
  {
    icon: FolderOpen,
    title: "Histórico e Comprovantes",
    description: "Mantenha todos os seus comprovantes organizados e acessíveis. Nunca mais perca um documento importante.",
    image: "left"
  },
  {
    icon: Smartphone,
    title: "Acesse de Qualquer Lugar",
    description: "Design responsivo que funciona perfeitamente em desktop, tablet e celular. Suas finanças sempre ao alcance.",
    image: "right"
  }
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            Funcionalidades
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Recursos poderosos para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              sua organização
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Conheça em detalhes tudo o que o MyFinance pode fazer por você.
          </p>
        </motion.div>

        <div className="space-y-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col ${feature.image === "right" ? "lg:flex-row" : "lg:flex-row-reverse"
                } items-center gap-8 lg:gap-16`}
            >
              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 mb-5">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  {feature.description}
                </p>
              </div>

              {/* Visual placeholder */}
              <div className="flex-1 w-full">
                <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-soft-lg">
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl flex items-center justify-center">
                    <feature.icon className="w-16 h-16 text-primary/30" />
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
