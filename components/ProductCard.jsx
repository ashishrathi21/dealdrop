"use client";

import { useState } from "react";
import { deleteProduct } from "@/app/actions";
import PriceChart from "./PriceChart";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Trash2,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ProductCard({ product }) {
  const [showChart, setShowChart] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this product from tracking?")) return;

    setDeleting(true);
    const res = await deleteProduct(product.id);
    if (res?.error) {
      toast.error(res.error || "Failed to remove product.");
      setDeleting(false);
    } else {
      toast.success("Product removed from tracking.");
    }
  };

  // Helper to resolve store name and color badge styles dynamically
  const getStoreInfo = (url) => {
    const lowUrl = url ? url.toLowerCase() : "";
    if (lowUrl.includes("amazon")) return { name: "Amazon", color: "bg-amber-50 text-amber-700 border-amber-200" };
    if (lowUrl.includes("flipkart")) return { name: "Flipkart", color: "bg-blue-50 text-blue-700 border-blue-200" };
    if (lowUrl.includes("myntra")) return { name: "Myntra", color: "bg-pink-50 text-pink-700 border-pink-200" };
    if (lowUrl.includes("ajio")) return { name: "Ajio", color: "bg-teal-50 text-teal-700 border-teal-200" };
    if (lowUrl.includes("croma")) return { name: "Croma", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (lowUrl.includes("reliance")) return { name: "Reliance Digital", color: "bg-red-50 text-red-700 border-red-200" };
    return { name: "E-Commerce", color: "bg-violet-50 text-violet-750 border-violet-200" };
  };

  const store = getStoreInfo(product.url);
  const initialPrice = product.initial_price || product.current_price;
  const isDrop = product.current_price < initialPrice;
  const savings = initialPrice - product.current_price;

  return (
    <Card className="bg-card border-border hover:border-violet-500/20 hover:shadow-lg transition-all duration-300 rounded-xl shadow-sm flex flex-col justify-between overflow-hidden">
      <CardHeader className="p-5 pb-3">
        <div className="flex gap-4 items-start">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className="w-20 h-22 object-contain p-1 bg-white rounded-lg border border-border shrink-0"
            />
          )}

          <div className="flex-1 min-w-0">
            {/* Store Badge */}
            <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${store.color} mb-1`}>
              {store.name}
            </span>

            {/* Product Title */}
            <h3 className="font-bold text-zinc-900 line-clamp-2 text-sm leading-snug mb-1">
              {product.name}
            </h3>

            {/* Price Details */}
            <div className="flex flex-wrap items-baseline gap-2 mt-1.5">
              <span className="text-xl font-extrabold text-violet-650">
                {product.currency} {product.current_price.toLocaleString()}
              </span>
              
              {isDrop && (
                <>
                  <span className="text-xs text-zinc-400 line-through">
                    {product.currency} {initialPrice.toLocaleString()}
                  </span>
                  <Badge variant="secondary" className="gap-1 bg-emerald-50 text-emerald-700 border-emerald-200 border text-[10px] font-bold py-0.5 rounded px-2">
                    <TrendingDown className="w-3 h-3" />
                    ₹{savings.toLocaleString()} Saved
                  </Badge>
                </>
              )}

              {!isDrop && (
                <span className="inline-flex items-center text-[10px] text-zinc-500 font-semibold bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded-md">
                  Active Alerts
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0">
        <div className="flex items-center justify-between gap-1 w-full flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChart(!showChart)}
              className="gap-1.5 bg-zinc-50 border-border hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 !rounded-md cursor-pointer text-xs font-semibold px-2 py-1 h-8 transition-colors"
            >
              {showChart ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                  Hide Chart
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                  Show Chart
                </>
              )}
            </Button>

            <Link
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-1.5 bg-zinc-50 border-border hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 !rounded-md cursor-pointer text-xs font-semibold px-2 py-1 h-8 transition-colors flex items-center justify-center"
              )}
            >
              <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
              View Product
            </Link>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5 cursor-pointer !rounded-md text-xs font-semibold px-2 py-1 h-8 transition-colors shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove
          </Button>
        </div>
      </CardContent>

      {showChart && (
        <CardFooter className="pt-0 border-t border-border p-5">
          <PriceChart productId={product.id} />
        </CardFooter>
      )}
    </Card>
  );
}