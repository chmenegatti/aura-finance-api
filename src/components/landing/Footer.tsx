import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-border/50 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and description */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold text-foreground">Aura Finance</span>
              <p className="text-sm text-muted-foreground">
                Organize suas finanças de forma simples
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/auth"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Login
            </Link>
            <Link
              to="/auth"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cadastro
            </Link>
            <a
              href="#funcionalidades"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Funcionalidades
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Aura Finance. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};
