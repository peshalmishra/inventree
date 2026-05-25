import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { SERVER_URL } from "../../router";
import {
  Sparkles,
  Tags,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Coins,
  ChevronRight,
} from "lucide-react";

const tools = [
  { id: "description", name: "Description Generator", icon: Sparkles, color: "#a855f7" },
  { id: "tags", name: "SEO Tags Generator", icon: Tags, color: "#3b82f6" },
  { id: "captions", name: "Marketing Captions", icon: MessageSquare, color: "#10b981" },
  { id: "pricing", name: "Smart Pricing Advice", icon: DollarSign, color: "#f59e0b" },
  { id: "trending", name: "Trending Product Ideas", icon: TrendingUp, color: "#ef4444" },
];

function AIGenerator() {
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [error, setError] = useState("");

  // Common Inputs
  const [title, setTitle] = useState("");
  const [model, setModel] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  // Pricing Inputs
  const [costPrice, setCostPrice] = useState("");
  const [targetMargin, setTargetMargin] = useState("");
  const [competitorPrices, setCompetitorPrices] = useState("");

  // Results
  const [resultDescription, setResultDescription] = useState("");
  const [resultTags, setResultTags] = useState([]);
  const [resultCaptions, setResultCaptions] = useState(null);
  const [resultPricing, setResultPricing] = useState(null);
  const [resultTrending, setResultTrending] = useState([]);
  const [isMock, setIsMock] = useState(false);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(""), 2000);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsMock(false);

    try {
      let endpoint = "";
      let payload = {};

      if (activeTab === "description") {
        endpoint = "/description";
        payload = { title, model, manufacturer, category };
      } else if (activeTab === "tags") {
        endpoint = "/tags";
        payload = { title, description, category };
      } else if (activeTab === "captions") {
        endpoint = "/caption";
        payload = { title, model, description };
      } else if (activeTab === "pricing") {
        endpoint = "/pricing";
        payload = { costPrice, targetMargin, competitorPrices };
      } else if (activeTab === "trending") {
        endpoint = "/trending";
        payload = { category };
      }

      const token = localStorage.getItem("token");
      const { data } = await axios.post(`${SERVER_URL}/api/ai${endpoint}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setIsMock(!!data.isMock);
        if (activeTab === "description") {
          setResultDescription(data.description);
        } else if (activeTab === "tags") {
          setResultTags(data.tags);
        } else if (activeTab === "captions") {
          setResultCaptions(data.captions);
        } else if (activeTab === "pricing") {
          setResultPricing(data.pricing);
        } else if (activeTab === "trending") {
          setResultTrending(data.trending);
        }
      } else {
        setError("Generation failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong while connecting to the AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-full pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Sparkles size={28} className="text-purple-400 animate-pulse" />
            AI Utilities & Generator
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Leverage Gemini 3.5 Flash to automatically create copy, optimize pricing, suggest trending products, and generate tags.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-white/20 px-3 mb-2">Select AI Agent</h2>
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTab === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTab(tool.id);
                  setError("");
                }}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/[0.06] border border-white/[0.1] shadow-lg shadow-black/25 text-white"
                    : "text-white/50 border border-transparent hover:bg-white/[0.02] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                    style={{ background: isActive ? `linear-gradient(135deg, ${tool.color}, #3b82f6)` : "rgba(255,255,255,0.03)" }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-sm">{tool.name}</span>
                </div>
                <ChevronRight size={16} className={`opacity-30 transition-transform ${isActive ? "rotate-90" : ""}`} />
              </button>
            );
          })}
        </div>

        {/* Workspace Panel */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="glass-card p-6 rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl relative overflow-hidden"
            >
              {isMock && (
                <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 animate-pulse">
                  <AlertCircle size={12} />
                  Mock Fallback Active (Missing API Key)
                </div>
              )}

              <h2 className="text-xl font-bold text-white mb-6">
                {tools.find((t) => t.id === activeTab)?.name}
              </h2>

              <form onSubmit={handleGenerate} className="space-y-6">
                {/* Conditionally Render Inputs based on tab */}
                {activeTab === "description" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/50">Product Title</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. MacBook Pro 16"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/50">Model / Version</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. M3 Max 36GB"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/50">Manufacturer / Brand</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Apple"
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/50">Product Category</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Laptops"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "tags" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/50">Product Title</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Dell PowerEdge R750"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/50">Category</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Servers"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/50">Base Description</label>
                      <textarea
                        required
                        placeholder="Provide details about the product to base tags on..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "captions" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/50">Product Title</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Razer BlackWidow V4"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/50">Model</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Mechanical Gaming Keyboard"
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/50">Product Description</label>
                      <textarea
                        required
                        placeholder="Briefly describe the product's highlights..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "pricing" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/50">Cost Price ($)</label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          placeholder="e.g. 500"
                          value={costPrice}
                          onChange={(e) => setCostPrice(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-white/50">Target Margin (%)</label>
                        <input
                          required
                          type="number"
                          placeholder="e.g. 25"
                          value={targetMargin}
                          onChange={(e) => setTargetMargin(e.target.value)}
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-white/50">Competitor Prices (Optional description/list)</label>
                      <input
                        type="text"
                        placeholder="e.g. Store A: $650, Store B: $700, Online: $630"
                        value={competitorPrices}
                        onChange={(e) => setCompetitorPrices(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "trending" && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/50">Product Category</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Smart Home Security, Green Energy, Wearables"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 btn-primary py-3.5 rounded-2xl text-sm font-semibold relative overflow-hidden transition-all active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${
                      tools.find((t) => t.id === activeTab)?.color || "#7c3aed"
                    }, #3b82f6)`,
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Asking Gemini Client...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Generate AI Result</span>
                    </>
                  )}
                </button>
              </form>

              {/* Display Result Panel */}
              <AnimatePresence>
                {/* Result Description */}
                {activeTab === "description" && resultDescription && !loading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-8 border-t border-white/[0.06] pt-6 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white/70">Generated Description</h3>
                      <button
                        onClick={() => handleCopy(resultDescription, "desc")}
                        className="text-white/40 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
                      >
                        {copiedText === "desc" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copiedText === "desc" ? "Copied!" : "Copy Description"}
                      </button>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl text-white/80 text-sm leading-relaxed">
                      {resultDescription}
                    </div>
                  </motion.div>
                )}

                {/* Result Tags */}
                {activeTab === "tags" && resultTags.length > 0 && !loading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-8 border-t border-white/[0.06] pt-6 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-white/70">Recommended SEO Tags</h3>
                      <button
                        onClick={() => handleCopy(resultTags.join(", "), "tags")}
                        className="text-white/40 hover:text-white flex items-center gap-1.5 text-xs transition-colors"
                      >
                        {copiedText === "tags" ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                        {copiedText === "tags" ? "Copied All!" : "Copy All Tags"}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resultTags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3.5 py-1.5 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Result Captions */}
                {activeTab === "captions" && resultCaptions && !loading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-8 border-t border-white/[0.06] pt-6 space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-white/70">Social Media Captions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Instagram */}
                      <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl space-y-3 relative flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-pink-400">Instagram</span>
                          <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line">{resultCaptions.instagram}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(resultCaptions.instagram, "ig")}
                          className="w-full mt-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/60 hover:text-white text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {copiedText === "ig" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          {copiedText === "ig" ? "Copied" : "Copy Caption"}
                        </button>
                      </div>

                      {/* Twitter / X */}
                      <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl space-y-3 relative flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-sky-400">Twitter / X</span>
                          <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line">{resultCaptions.twitter}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(resultCaptions.twitter, "tw")}
                          className="w-full mt-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/60 hover:text-white text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {copiedText === "tw" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          {copiedText === "tw" ? "Copied" : "Copy Caption"}
                        </button>
                      </div>

                      {/* Facebook */}
                      <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl space-y-3 relative flex flex-col justify-between">
                        <div className="space-y-2">
                          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400">Facebook</span>
                          <p className="text-xs text-white/80 leading-relaxed whitespace-pre-line">{resultCaptions.facebook}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(resultCaptions.facebook, "fb")}
                          className="w-full mt-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-white/60 hover:text-white text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                        >
                          {copiedText === "fb" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          {copiedText === "fb" ? "Copied" : "Copy Caption"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Result Pricing */}
                {activeTab === "pricing" && resultPricing && !loading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-8 border-t border-white/[0.06] pt-6 space-y-6"
                  >
                    <h3 className="text-sm font-semibold text-white/70">Pricing Advice & Analysis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Min Price */}
                      <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl text-center space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-white/30">Min Price</span>
                        <div className="text-2xl font-bold text-white">${resultPricing.minPrice}</div>
                        <p className="text-[10px] text-white/40">Lower bound market ceiling</p>
                      </div>

                      {/* Optimal Price */}
                      <div className="bg-brand-500/10 border border-brand-500/20 p-4 rounded-2xl text-center space-y-1.5 shadow-lg shadow-brand-500/5">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-brand-400">Optimal Price</span>
                        <div className="text-2xl font-extrabold text-white">${resultPricing.optimalPrice}</div>
                        <p className="text-[10px] text-brand-300/60 font-medium">Recommended Listing Price</p>
                      </div>

                      {/* Max Price */}
                      <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl text-center space-y-1.5">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-white/30">Max Price</span>
                        <div className="text-2xl font-bold text-white">${resultPricing.maxPrice}</div>
                        <p className="text-[10px] text-white/40">Upper boundary threshold</p>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2 text-amber-400">
                        <Coins size={16} />
                        <h4 className="text-xs font-bold uppercase tracking-wider">Sale & Promotion Strategy</h4>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed whitespace-pre-line">{resultPricing.saleAdvice}</p>
                      {resultPricing.recommendedDiscountPercent > 0 && (
                        <div className="inline-block bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 px-3.5 py-1.5 rounded-xl text-xs font-semibold mt-2">
                          Recommended Promo Discount: {resultPricing.recommendedDiscountPercent}% OFF
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Result Trending */}
                {activeTab === "trending" && resultTrending.length > 0 && !loading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-8 border-t border-white/[0.06] pt-6 space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-white/70">5 Trending Product Ideas</h3>
                    <div className="space-y-3">
                      {resultTrending.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] p-4 rounded-2xl flex items-start gap-4 transition-all duration-200"
                        >
                          <div className="h-7 w-7 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                            <p className="text-xs text-white/50 leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AIGenerator;
