import { motion } from "framer-motion";
import { Plus, Upload, FileText, Image, Download, Eye, Trash2, Calendar } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatFullDate } from "@/lib/finance";

// Mock receipt data
const receipts = [
  {
    id: "1",
    name: "Nota Fiscal Supermercado",
    type: "pdf",
    date: new Date("2025-12-10"),
    amount: 456.78,
    category: "Alimentação",
    icon: "🍽️",
    preview: null,
  },
  {
    id: "2",
    name: "Comprovante Uber",
    type: "image",
    date: new Date("2025-12-12"),
    amount: 32.5,
    category: "Transporte",
    icon: "🚗",
    preview: null,
  },
  {
    id: "3",
    name: "Recibo Consulta Médica",
    type: "pdf",
    date: new Date("2025-12-18"),
    amount: 250,
    category: "Saúde",
    icon: "💊",
    preview: null,
  },
  {
    id: "4",
    name: "Nota Restaurante",
    type: "image",
    date: new Date("2025-12-25"),
    amount: 187.5,
    category: "Alimentação",
    icon: "🍽️",
    preview: null,
  },
  {
    id: "5",
    name: "Comprovante Combustível",
    type: "pdf",
    date: new Date("2025-12-27"),
    amount: 220,
    category: "Transporte",
    icon: "🚗",
    preview: null,
  },
  {
    id: "6",
    name: "Recibo Curso Online",
    type: "pdf",
    date: new Date("2025-12-22"),
    amount: 89.9,
    category: "Educação",
    icon: "📚",
    preview: null,
  },
];

const Receipts = () => {
  const totalValue = receipts.reduce((acc, r) => acc + r.amount, 0);

  return (
    <MainLayout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Comprovantes
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize e armazene seus comprovantes
          </p>
        </div>
        <Button variant="default" size="lg" className="gap-2">
          <Upload className="w-5 h-5" />
          <span>Enviar Comprovante</span>
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total de Arquivos</div>
              <div className="text-3xl font-bold text-foreground">{receipts.length}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Valor Documentado</div>
              <div className="text-3xl font-bold text-primary">{formatCurrency(totalValue)}</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Este Mês</div>
              <div className="text-3xl font-bold text-accent">{receipts.length} arquivos</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mb-8"
      >
        <Card variant="glass" className="border-dashed border-2 border-border hover:border-primary/50 transition-colors cursor-pointer group">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">
              Arraste e solte seus arquivos aqui
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              ou clique para selecionar. Suporta PDF e imagens.
            </p>
            <Button variant="outline">Selecionar Arquivos</Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Receipts Grid */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Arquivos Recentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {receipts.map((receipt, index) => (
          <motion.div
            key={receipt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
          >
            <Card variant="elevated" className="hover:shadow-soft-lg transition-all duration-300 group cursor-pointer overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${receipt.type === 'pdf' ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                    {receipt.type === 'pdf' ? (
                      <FileText className={`w-7 h-7 ${receipt.type === 'pdf' ? 'text-destructive' : 'text-primary'}`} />
                    ) : (
                      <Image className="w-7 h-7 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{receipt.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span>{receipt.icon}</span>
                      <span>{receipt.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatFullDate(receipt.date)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                  <span className="font-bold text-foreground">
                    {formatCurrency(receipt.amount)}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </MainLayout>
  );
};

export default Receipts;
