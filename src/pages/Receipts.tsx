import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Image, Download, Eye, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatFullDate } from "@/lib/finance";
import { receiptService, transactionService } from "@/services";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Transaction } from "@/types/finance";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

const Receipts = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const transactionsQuery = useQuery({
    queryKey: ["transactions", { page: 1, pageSize: 500 }],
    queryFn: () => transactionService.listPaginated({ page: 1, pageSize: 500 }),
  });

  const allTransactions = transactionsQuery.data?.items ?? [];

  const transactionsWithReceipt = allTransactions.filter(
    (t) => Boolean(t.receipt) || Boolean(t.receiptUrl)
  );

  const transactionsWithoutReceipt = allTransactions.filter(
    (t) => !t.receipt && !t.receiptUrl
  );

  const totalValue = transactionsWithReceipt.reduce((acc, t) => acc + t.amount, 0);

  const thisMonthCount = useMemo(() => {
    const now = new Date();
    return transactionsWithReceipt.filter((t) => {
      return (
        t.date.getMonth() === now.getMonth() &&
        t.date.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [transactionsWithReceipt]);

  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    if (!selectedFile.type.startsWith("image/")) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedTransactionId) {
      toast({ title: "Selecione uma transação", description: "Escolha a transação para anexar o comprovante." });
      return;
    }
    if (!selectedFile) {
      toast({ title: "Selecione um arquivo", description: "Escolha um PDF ou imagem." });
      return;
    }

    try {
      setIsUploading(true);
      await receiptService.upload({ transactionId: selectedTransactionId, file: selectedFile });
      toast({ title: "Comprovante enviado", description: "Upload concluído com sucesso." });
      setSelectedFile(null);
      setSelectedTransactionId("");
      await transactionsQuery.refetch();
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (receiptId: string, fileName?: string) => {
    const blob = await receiptService.download(receiptId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || `receipt-${receiptId}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handlePreview = async (receiptId: string) => {
    const blob = await receiptService.download(receiptId);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    // revogar depois de um tempo para permitir o viewer carregar
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };

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
              <div className="text-3xl font-bold text-foreground">{transactionsWithReceipt.length}</div>
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
              <div className="text-3xl font-bold text-accent">{thisMonthCount} arquivos</div>
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
        <Card variant="glass" className="border-dashed border-2 border-border hover:border-primary/50 transition-colors group">
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

            <div className="max-w-xl mx-auto space-y-3">
              <Select value={selectedTransactionId} onValueChange={setSelectedTransactionId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma transação" />
                </SelectTrigger>
                <SelectContent>
                  {transactionsWithoutReceipt.slice(0, 50).map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.description} • {formatCurrency(t.amount)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
              />

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" onClick={openFilePicker} disabled={isUploading}>
                  Selecionar Arquivo
                </Button>
                <Button onClick={handleUpload} disabled={isUploading || !selectedFile || !selectedTransactionId}>
                  {isUploading ? "Enviando..." : "Enviar"}
                </Button>
              </div>

              {selectedFile && (
                <div className="text-sm text-muted-foreground">
                  Arquivo selecionado: <span className="text-foreground font-medium">{selectedFile.name}</span>
                </div>
              )}

              {previewUrl && (
                <div className="mt-3 flex justify-center">
                  <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg border border-border" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Receipts Grid */}
      <h2 className="text-lg font-semibold text-foreground mb-4">Arquivos Recentes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {transactionsQuery.isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))
        ) : transactionsWithReceipt.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Nenhum comprovante encontrado
          </div>
        ) : (
          transactionsWithReceipt.slice(0, 30).map((t, index) => {
            const mime = t.receipt?.mimeType;
            const isPdf = mime?.includes("pdf") ?? false;
            const receiptId = t.receipt?.id;
            const title = t.receipt?.fileName || t.description;

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              >
                <Card variant="elevated" className="hover:shadow-soft-lg transition-all duration-300 group cursor-pointer overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isPdf ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                        {isPdf ? (
                          <FileText className={`w-7 h-7 ${isPdf ? 'text-destructive' : 'text-primary'}`} />
                        ) : (
                          <Image className="w-7 h-7 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <CategoryIcon iconName={t.category.icon} className="w-4 h-4" />
                          <span>{t.category.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatFullDate(t.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                      <span className="font-bold text-foreground">
                        {formatCurrency(t.amount)}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={!receiptId}
                          onClick={() => receiptId && handlePreview(receiptId)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={!receiptId}
                          onClick={() => receiptId && handleDownload(receiptId, t.receipt?.fileName)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </MainLayout>
  );
};

export default Receipts;
