import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Aura Finance</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#funcionalidades" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Funcionalidades
          </a>
          <a href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Como Funciona
          </a>
          <a href="#diferenciais" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
            Diferenciais
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/auth">Entrar</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/auth">Criar Conta</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
