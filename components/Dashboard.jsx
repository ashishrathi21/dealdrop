"use client";

import React, { useState, useMemo } from "react";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  LogOut, 
  ArrowUpRight, 
  Tag, 
  TrendingDown,
  Menu,
  X,
  Plus
} from "lucide-react";
import AddProductForm from "./AddProductForm";
import ProductCard from "./ProductCard";
import DashboardChart from "./DashboardChart";
import { signOut } from "@/app/actions";

export default function Dashboard({ user, products = [], priceHistory = [] }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userEmail = user?.email || "Shopper";
  const userInit = userEmail[0].toUpperCase();

  // 1. Calculate Real Dynamic Statistics
  const stats = useMemo(() => {
    let totalProducts = products.length;
    let activeAlerts = products.length; // all items are live-monitored
    let priceDropsCount = 0;
    let totalSaved = 0;

    products.forEach((p) => {
      // Find history for this product
      const productHistory = priceHistory
        .filter((h) => h.product_id === p.id)
        .sort((a, b) => new Date(a.checked_at) - new Date(b.checked_at));
      
      // Oldest record represents initial price
      const initialPrice = productHistory.length > 0 ? productHistory[0].price : p.current_price;
      
      if (p.current_price < initialPrice) {
        priceDropsCount += 1;
        totalSaved += (initialPrice - p.current_price);
      }
    });

    return {
      totalProducts,
      activeAlerts,
      priceDropsCount,
      totalSaved: Math.round(totalSaved)
    };
  }, [products, priceHistory]);

  // 2. Generate Real Dynamic Activity List
  const activities = useMemo(() => {
    const list = [];
    
    products.forEach((p) => {
      const productHistory = priceHistory
        .filter((h) => h.product_id === p.id)
        .sort((a, b) => new Date(a.checked_at) - new Date(b.checked_at));
      
      const initialPrice = productHistory.length > 0 ? productHistory[0].price : p.current_price;
      const isDrop = p.current_price < initialPrice;
      const eventTime = new Date(p.updated_at || p.created_at);

      if (isDrop) {
        list.push({
          id: `drop-${p.id}`,
          type: "drop",
          title: `Price Drop: ${p.name}`,
          description: `Dropped to ${p.currency} ${p.current_price} from ${p.currency} ${initialPrice}`,
          time: eventTime,
          timeLabel: eventTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        });
      } else {
        list.push({
          id: `track-${p.id}`,
          type: "track",
          title: `Started Tracking: ${p.name}`,
          description: `Initialized alerts for ${p.currency} ${p.current_price}`,
          time: eventTime,
          timeLabel: eventTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        });
      }
    });

    // Sort by most recent activity timestamp first
    return list.sort((a, b) => b.time - a.time).slice(0, 4);
  }, [products, priceHistory]);

  // Recently added products to highlight at the bottom
  const highlightProducts = useMemo(() => {
    return products.slice(0, 3);
  }, [products]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row relative">
      
      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between border-b border-border bg-card px-6 h-16 shrink-0 relative z-30">
        <img src="/logo-2.png" alt="DealDrop Logo" className="h-8 w-auto" />
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-zinc-600 hover:text-zinc-950 p-2 rounded-lg bg-zinc-50 border border-border cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-zinc-50 border-r border-border flex flex-col justify-between z-40 transition-transform duration-300 md:translate-x-0 md:fixed md:h-screen
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-full flex flex-col overflow-hidden">
          {/* Logo container */}
          <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-white shrink-0">
            <img src="/logo-2.png" alt="DealDrop Logo" className="h-12 w-auto" />
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            <button
              onClick={() => {
                setActiveTab("dashboard");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all
                ${activeTab === "dashboard" 
                  ? "bg-violet-50 text-violet-650 font-semibold shadow-sm" 
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-150"
                }
              `}
            >
              <LayoutDashboard className="w-[18px] h-[18px]" />
              Dashboard
            </button>

            <button
              onClick={() => {
                setActiveTab("products");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all
                ${activeTab === "products" 
                  ? "bg-violet-50 text-violet-650 font-semibold shadow-sm" 
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-150"
                }
              `}
            >
              <ShoppingBag className="w-[18px] h-[18px]" />
              My Products
            </button>
          </nav>

          {/* User profile & Logout */}
          <div className="border-t border-border bg-white shrink-0">
            <div className="p-4 flex items-center gap-3 border-b border-border">
              <div className="w-9 h-9 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-sm shrink-0 uppercase shadow-sm">
                {userInit}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Signed in as</p>
                <p className="text-xs font-semibold text-zinc-800 truncate mt-0.5">{userEmail}</p>
              </div>
            </div>

            <form action={signOut} className="p-3">
              <button 
                type="submit"
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-64 min-h-screen bg-background flex flex-col overflow-y-auto">
        
        {/* Dynamic Inner views (Full-width containers without max-w constraint) */}
        <div className="flex-1 p-6 md:p-8 w-full">
          
          {activeTab === "dashboard" ? (
            <>
              {/* Dashboard Header */}
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                  Welcome !
                </h2>
                <p className="text-zinc-500 text-sm mt-1 leading-relaxed">
                  Your tracked portfolio is currently active.
                </p>
              </div>

              {/* Add Product Form Top Container - Full Width & Less Rounding */}
              <div className="bg-card border border-border p-6 rounded-xl shadow-sm mb-8 relative overflow-hidden w-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-100/30 rounded-full blur-2xl pointer-events-none" />
                <h3 className="text-base font-bold text-zinc-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
                  Track New Product
                </h3>
                <AddProductForm user={user} />
              </div>

              {/* Stats Grid - Less Rounding */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat 1 */}
                <div className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-violet-500/10 transition-colors">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Total Products</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-zinc-900">{stats.totalProducts}</span>
                    <span className="text-[10px] text-zinc-500 font-semibold">items</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-violet-500/10 transition-colors">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Active Alerts</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-zinc-900">{stats.activeAlerts}</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md">Steady</span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-violet-500/10 transition-colors">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Price Drops</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-zinc-900">{stats.priceDropsCount}</span>
                    <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-md">Alerts</span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-card border border-border p-5 rounded-xl shadow-sm hover:border-violet-500/10 transition-colors">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Money Saved</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl font-extrabold text-violet-650">₹{stats.totalSaved.toLocaleString()}</span>
                    <span className="text-[10px] text-zinc-500 font-semibold">saved</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Rows */}
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Left Column: Price Trends */}
                <div className="lg:col-span-2 bg-card border border-border p-6 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-base font-bold text-zinc-900">Price Trends</h4>
                      <p className="text-xs text-zinc-400 mt-0.5">Average tracked price performance</p>
                    </div>
                  </div>
                  <DashboardChart products={products} priceHistory={priceHistory} />
                </div>

                {/* Right Column: Recent Activity */}
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-zinc-900 mb-6">Recent Activity</h4>
                    <div className="space-y-4">
                      {activities.length > 0 ? (
                        activities.map((act) => (
                          <div key={act.id} className="flex gap-3 text-sm">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 border
                              ${act.type === "drop" 
                                ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                                : "bg-blue-50 border-blue-100 text-blue-600"
                              }
                            `}>
                              {act.type === "drop" ? <TrendingDown className="w-4 h-4" /> : <Tag className="w-4 h-4" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h5 className="font-semibold text-zinc-800 truncate">{act.title}</h5>
                              <p className="text-xs text-zinc-500 truncate mt-0.5">{act.description}</p>
                            </div>
                            <span className="text-[10px] text-zinc-400 font-medium shrink-0 mt-0.5">{act.timeLabel}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500 text-center py-6">No recent updates.</p>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab("products")}
                    className="w-full text-center text-xs font-bold text-violet-600 hover:text-violet-750 transition-colors py-2.5 border-t border-border mt-6 cursor-pointer font-semibold"
                  >
                    View All Products
                  </button>
                </div>
              </div>

              {/* Bottom Recently Added Highlights */}
              <div className="border-t border-border pt-8">
                <h4 className="text-base font-bold text-zinc-900 mb-6">Recently Added Products</h4>
                {highlightProducts.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-3 items-start">
                    {highlightProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-border border-dashed p-10 rounded-xl text-center">
                    <p className="text-sm text-zinc-500">No tracked products yet.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* My Products Tab */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/80">
                <div>
                  <h2 className="text-2xl font-extrabold text-zinc-900 tracking-tight">My Products</h2>
                  <p className="text-zinc-500 text-sm mt-1 leading-relaxed">Monitoring {products.length} products for live price updates</p>
                </div>
                <span className="text-xs bg-violet-100 text-violet-700 border border-violet-200 px-3 py-1.5 rounded-lg font-semibold shadow-sm shrink-0">
                  {products.length} {products.length === 1 ? "Product" : "Products"} Tracked
                </span>
              </div>

              {products.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 items-start">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center max-w-2xl mx-auto mt-8">
                  <TrendingDown className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-zinc-900 mb-2">No products yet</h3>
                  <p className="text-zinc-500 text-sm mb-6">Start tracking your first item using the search bar on the Dashboard tab!</p>
                  <button 
                    onClick={() => setActiveTab("dashboard")}
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all cursor-pointer shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
