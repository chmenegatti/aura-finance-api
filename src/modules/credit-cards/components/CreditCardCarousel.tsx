import { useCallback, useEffect, useState } from "react";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import type { CreditCard, CreditCardInvoice } from "../types/credit-card";
import { CreditCardItem } from "./CreditCardItem";

interface CreditCardCarouselProps {
  cards: CreditCard[];
  activeCardId?: string;
  invoice?: CreditCardInvoice;
  isLoading?: boolean;
  onCardSelect?: (cardId: string) => void;
}

export function CreditCardCarousel({
  cards,
  activeCardId,
  invoice,
  isLoading,
  onCardSelect,
}: CreditCardCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const syncActiveIndex = useCallback(() => {
    if (!carouselApi) {
      return;
    }

    const index = carouselApi.selectedScrollSnap();
    setActiveIndex(index);

    const card = cards[index];
    if (card && card.id !== activeCardId) {
      onCardSelect?.(card.id);
    }
  }, [carouselApi, cards, activeCardId, onCardSelect]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    syncActiveIndex();
    carouselApi.on("reInit", syncActiveIndex);
    carouselApi.on("select", syncActiveIndex);

    return () => {
      carouselApi.off("reInit", syncActiveIndex);
      carouselApi.off("select", syncActiveIndex);
    };
  }, [carouselApi, syncActiveIndex]);

  useEffect(() => {
    if (!carouselApi || !activeCardId) {
      return;
    }

    const targetIndex = cards.findIndex((card) => card.id === activeCardId);
    if (targetIndex < 0) {
      return;
    }

    carouselApi.scrollTo(targetIndex);
  }, [activeCardId, cards, carouselApi]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[1, 2, 3].map((skeleton) => (
          <Skeleton key={skeleton} className="h-60 rounded-3xl" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border/70 p-8 text-center text-sm text-muted-foreground">
        <p className="font-semibold text-foreground">Você ainda não possui cartões cadastrados.</p>
        <p>Assim que houver faturas, elas aparecerão neste carrossel.</p>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center py-2">
      <div className="w-full max-w-4xl md:max-w-3xl">
        <Carousel
          className="relative pb-6 min-h-[12rem] md:min-h-[12rem]"
          setApi={setCarouselApi}
          opts={{
            loop: false,
            align: "center",
            containScroll: "trimSnaps",
          }}
        >
          <CarouselContent className="flex gap-0 p-6">
            {cards.map((card) => (
              <CarouselItem
                key={card.id}
                className="w-full flex-[0_0_auto] flex justify-center"
              >
                <div className="pl-6 w-full max-w-[28rem] md:max-w-[28rem]">
                  <CreditCardItem
                    card={card}
                    invoice={card.id === activeCardId ? invoice : undefined}
                    isActive={card.id === activeCardId}
                    onSelect={onCardSelect}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className={cn(
              "hidden sm:flex",
              "left-2",
              "shadow-soft",
              { "opacity-40": !carouselApi?.canScrollPrev() },
            )}
            disabled={!carouselApi?.canScrollPrev()}
          />
          <CarouselNext
            className={cn(
              "hidden sm:flex",
              "right-2",
              "shadow-soft",
              { "opacity-40": !carouselApi?.canScrollNext() },
            )}
            disabled={!carouselApi?.canScrollNext()}
          />
        </Carousel>
        <div className="flex justify-center pt-2 text-sm font-semibold text-muted-foreground">
          <span className="tracking-wide">
            {cards.length} {cards.length === 1 ? "cartão" : "cartões"}
          </span>
        </div>
      </div>
    </div>
  );
}
