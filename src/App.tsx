/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Tv, 
  Flame, 
  TrendingUp, 
  BookOpen, 
  Trash2, 
  History, 
  Sliders, 
  Globe, 
  BadgePercent,
  RefreshCw,
  ArrowRightLeft
} from "lucide-react";
import { INPUT_TEMPLATES, InputTemplate } from "./data";
import { GenerateResponse, TitleOption } from "./types";

export default function App() {
  // Input states
  const [content, setContent] = useState<string>("");
  const [macroTrigger, setMacroTrigger] = useState<string>("");
  const [extData, setExtData] = useState<string>("");
  const [extraKeywords, setExtraKeywords] = useState<string>("");
  const [userFocus, setUserFocus] = useState<string>("大众理财套利");

  // App control states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<GenerateResponse | null>(null);
  const [selectedPlatformTab, setSelectedPlatformTab] = useState<"all" | "douyin" | "bilibili" | "financial">("all");
  const [history, setHistory] = useState<Array<{ content: string; res: GenerateResponse; date: string }>>([]);
  
  // Custom cover theme controls for Mockups
  const [coverTheme, setCoverTheme] = useState<"graphite" | "aurora" | "warning" | "glow">("graphite");
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  // Real-time developer custom playground sandbox
  const [customTitle, setCustomTitle] = useState<string>("");
  const [customCover, setCustomCover] = useState<string>("");

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("title_generator_history");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Save to local history
  const saveToHistory = (newContent: string, newRes: GenerateResponse) => {
    try {
      const updated = [
        { content: newContent, res: newRes, date: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) },
        ...history.slice(0, 9)
      ];
      setHistory(updated);
      localStorage.setItem("title_generator_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  };

  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("title_generator_history");
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  // Apply template event
  const handleApplyTemplate = (tpl: InputTemplate) => {
    setContent(tpl.content);
    setMacroTrigger(tpl.macroTrigger || "");
    setExtData(tpl.extData || "");
    setExtraKeywords(tpl.extraKeywords || "");
    setError(null);
  };

  // Generate handlers
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("请先输入文本、大纲或素材内容。");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-titles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          content,
          extraKeywords,
          macroTrigger,
          extData,
          userFocus
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "请求生成失败，请确认后端服务运行正常。");
      }

      setResponse(data);
      saveToHistory(content, data);

      // Pre-populate Sandbox
      if (data.douyin && data.douyin.length > 0) {
        setCustomTitle(data.douyin[0].title);
        setCustomCover(data.douyin[0].coverText);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "生成器发生未知故障，请检查配置。");
    } finally {
      setLoading(false);
    }
  };

  // Image mockup themes
  const THEME_STYLES = {
    graphite: {
      bg: "bg-gradient-to-br from-neutral-900 via-zinc-800 to-neutral-950",
      accentLine: "bg-sky-400",
      text: "text-white font-extrabold tracking-tight",
      coverBorder: "border-neutral-700",
      tagColor: "bg-sky-500/20 text-sky-300 border border-sky-500/30",
      badgeStyle: "🔴 宇宙暗矿"
    },
    aurora: {
      bg: "bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900",
      accentLine: "bg-fuchsia-400",
      text: "text-fuchsia-100 font-extrabold tracking-tight drop-shadow-md",
      coverBorder: "border-purple-800",
      tagColor: "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30",
      badgeStyle: "🔮 电子极光"
    },
    warning: {
      bg: "bg-gradient-to-br from-amber-500 via-amber-600 to-neutral-900",
      accentLine: "bg-neutral-950",
      text: "text-neutral-950 font-black tracking-tighter",
      coverBorder: "border-amber-400",
      tagColor: "bg-neutral-900/40 text-amber-200 border border-amber-500/40",
      badgeStyle: "⚠️ 逆袭亮黄"
    },
    glow: {
      bg: "bg-gradient-to-br from-emerald-950 via-zinc-900 to-stone-950",
      accentLine: "bg-emerald-400",
      text: "text-emerald-100 font-black tracking-wide",
      coverBorder: "border-emerald-800",
      tagColor: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
      badgeStyle: "📈 交易荧绿"
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] selection:bg-[#EAEAEA]">
      
      {/* Editorial Aesthetic Top Brand Header */}
      <header className="border-b border-[#1A1A1A] bg-[#F5F5F0] sticky top-0 z-50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-serif italic font-black tracking-tight text-[#1A1A1A] flex items-center gap-2">
              Matrix Headlines
            </h1>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest opacity-60 mt-1 font-mono">
              短视频爆款大字矩阵 • Institutional Intelligence & Cross-Platform Adaptation
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-mono">
            {/* Strategy Hub placeholders as of design-html to keep aesthetic */}
            <div className="hidden lg:flex gap-4 opacity-40 mr-2">
              <span className="border-b border-[#1A1A1A] pb-0.5">Workspace Hub</span>
              <span>Analysis Core</span>
              <span>Strategy Vault</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="opacity-60 text-[11px] uppercase tracking-wide">封面调色:</span>
              <div className="flex border border-[#1A1A1A] bg-white p-0.5">
                {(Object.keys(THEME_STYLES) as Array<keyof typeof THEME_STYLES>).map((t) => (
                  <button
                    key={t}
                    id={`btn-theme-${t}`}
                    onClick={() => setCoverTheme(t)}
                    type="button"
                    className={`px-2 py-0.5 text-[10px] font-mono transition ${
                      coverTheme === t 
                        ? "bg-[#1A1A1A] text-[#F5F5F0]" 
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {t === "graphite" ? "矿砂" : t === "aurora" ? "霓虹" : t === "warning" ? "亮黄" : "荧绿"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Editorial Inputs Section */}
        <section className="lg:col-span-5 flex flex-col gap-6" id="input-desk">
          
          {/* Quick Real Demo Presets */}
          <div className="bg-white border border-[#1A1A1A] p-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#1A1A1A]"></div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 bg-red-650 bg-red-600 shrink-0"></span>
              <h2 className="text-xs uppercase font-bold tracking-tighter">I. SOURCE PRESETS / 实战分析模版</h2>
            </div>
            
            <p className="text-xs text-[#555] mb-4 font-serif leading-relaxed">
              选择下方精心整理的期现大货与硬科普高维题材，一键极速加载核心多空裂合数据。
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {INPUT_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  id={`tpl-btn-${idx}`}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="text-left p-3 border border-[#1A1A1A] hover:bg-[#F5F5F0] transition duration-200 group flex flex-col justify-between"
                >
                  <p className="font-bold text-[#1A1A1A] group-hover:underline transition line-clamp-1">
                    {tpl.name}
                  </p>
                  <div className="flex items-center justify-between mt-3 text-[9px] uppercase tracking-wider opacity-60">
                    <span>{tpl.tag}</span>
                    <span>&rarr;</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Engine */}
          <form onSubmit={handleGenerate} className="bg-white border border-[#1A1A1A] p-6 relative flex flex-col gap-5">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#1A1A1A]"></div>
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xs uppercase font-bold tracking-tighter flex items-center gap-2">
                <Sliders className="h-3.5 w-3.5 text-neutral-600" />
                II. ADJUST SYSTEM CRITERIA / 微调核心指令
              </h2>
              <button 
                type="button"
                id="reset-inputs-btn"
                onClick={() => {
                  setContent("");
                  setMacroTrigger("");
                  setExtData("");
                  setExtraKeywords("");
                }}
                className="text-[10px] font-mono text-neutral-400 hover:text-black hover:underline transition flex items-center gap-0.5"
              >
                <RefreshCw className="h-3 w-3" /> 重置
              </button>
            </div>

            {/* Core Text input */}
            <div className="space-y-1.5">
              <label htmlFor="core_content" className="block text-xs uppercase font-semibold text-neutral-700 flex justify-between">
                <span>文本草稿或大纲原稿 <span className="text-red-600 font-serif">*</span></span>
                <span className="font-mono text-[10px] text-slate-400">{content.length} 词宽</span>
              </label>
              <textarea
                id="core_content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请粘贴或输入需要重构的视频大纲。样例：‘近期红枣期货老库存仓单溢出，期限错配...’"
                rows={6}
                required
                className="w-full text-xs bg-white border border-[#1A1A1A] p-3 focus:outline-hidden focus:bg-[#F5F5F0]/20 transition font-serif leading-relaxed"
              />
            </div>

            {/* Inputs grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-semibold text-neutral-700 flex items-center gap-1">
                  <Globe className="h-3 w-3 text-neutral-400" /> 前置地缘/宏观触发剂
                </label>
                <input
                  type="text"
                  value={macroTrigger}
                  onChange={(e) => setMacroTrigger(e.target.value)}
                  placeholder="如: 中东原油海峡禁运博弈"
                  className="w-full text-xs bg-white border border-[#1A1A1A] px-3 py-2 focus:outline-hidden focus:bg-[#F5F5F0]/20 transition font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-semibold text-neutral-700 flex items-center gap-1">
                  <BadgePercent className="h-3 w-3 text-neutral-400" /> 精确核心大数字锚点
                </label>
                <input
                  type="text"
                  value={extData}
                  onChange={(e) => setExtData(e.target.value)}
                  placeholder="如: 695元大价差、暴攒100w"
                  className="w-full text-xs bg-white border border-[#1A1A1A] px-3 py-2 focus:outline-hidden focus:bg-[#F5F5F0]/20 transition font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase font-semibold text-neutral-700">物理限制 (禁止/强制词)</label>
                <input
                  type="text"
                  value={extraKeywords}
                  onChange={(e) => setExtraKeywords(e.target.value)}
                  placeholder="如: 不含煽动、强制合规、专业动作词"
                  className="w-full text-xs bg-white border border-[#1A1A1A] px-3 py-2 focus:outline-hidden font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase font-semibold text-neutral-700">受众智识等级与调性</label>
                <select
                  value={userFocus}
                  onChange={(e) => setUserFocus(e.target.value)}
                  className="w-full text-xs bg-white border border-[#1A1A1A] px-3 py-2 focus:outline-hidden font-mono"
                >
                  <option value="大众避险求生 (Douyin高阶偏好)">大众避险逃离 (抖音痛点认知)</option>
                  <option value="硬科普极客 (Bilibili深度推演偏好)">硬科普研判 (B站核心学术逻辑)</option>
                  <option value="期货与宏观大宗交易员 (专业定价背离偏好)">机构交易员 (套利与极端溢价)</option>
                  <option value="混合平衡模式 (全网引爆)">混合全流派平衡重组</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 border border-red-400 bg-red-50 text-xs text-red-700 flex items-start gap-2 animate-fade-in font-mono">
                <p><strong>[ERROR]</strong> {error}</p>
              </div>
            )}

            {/* Solid Block Action Button */}
            <button
              id="generate-cta-btn"
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-5 bg-[#1A1A1A] text-white hover:bg-[#333] tracking-widest text-xs uppercase transition-all duration-205 font-bold font-mono border border-black cursor-pointer flex items-center justify-center gap-2 ${
                loading ? "opacity-75 cursor-not-allowed" : "active:translate-y-px"
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>DEEP RESOLVING HEADLINES... / 深度编译中</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                  <span>PRECISE RECONSTRUCT NOW / 立即重构标的大字</span>
                </>
              )}
            </button>
          </form>

          {/* Local logs */}
          {history.length > 0 && (
            <div className="bg-white border border-[#1A1A1A] p-6 relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#1A1A1A]"></div>
              
              <div className="flex items-center justify-between mb-4 border-b border-[#1A1A1A] pb-3">
                <h4 className="text-xs uppercase font-bold tracking-tighter flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5 text-neutral-500" />
                  LOCAL DATA LOGS / 本地足迹 ({history.length})
                </h4>
                <button
                  type="button"
                  id="clear-history-btn"
                  onClick={clearHistory}
                  className="text-[10px] font-mono text-neutral-400 hover:text-red-600 transition underline underline-offset-2"
                >
                  <Trash2 className="h-3 w-3 inline mr-1" /> 清空历史
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-2 pr-1 text-xs font-mono">
                {history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setContent(h.content);
                      setResponse(h.res);
                      if (h.res.douyin && h.res.douyin.length > 0) {
                        setCustomTitle(h.res.douyin[0].title);
                        setCustomCover(h.res.douyin[0].coverText);
                      }
                    }}
                    className="w-full text-left p-3 border border-gray-200 hover:border-[#1A1A1A] bg-[#F5F5F0]/30 hover:bg-white text-[#1A1A1A] transition block relative"
                  >
                    <div className="flex justify-between items-center text-[9px] opacity-60 mb-1.5">
                      <span>TIME: {h.date}</span>
                      <span className="underline">LOAD BACK</span>
                    </div>
                    <p className="truncate font-semibold text-[#333] font-serif">{h.content}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right Side: Editorial Result Desk & Real-time Showcase Sandbox */}
        <section className="lg:col-span-7 flex flex-col gap-6" id="output-workspace">
          
          {/* Output Headers */}
          <div className="bg-white border border-[#1A1A1A] p-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#1A1A1A]"></div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1A1A1A] pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-[#1A1A1A] shrink-0"></span>
                  <h2 className="text-xs uppercase font-bold tracking-tighter">III. DEPLOYED MATRICES / 三端大字重建</h2>
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 font-serif">
                  对比各平台推荐机制；点击【输入沙盘】可在下方沙盒即时贴字预览。
                </p>
              </div>

              {/* Segmented flat indicators */}
              <div className="flex border border-[#1A1A1A] bg-[#F5F5F0] p-0.5 text-xs w-full sm:w-auto font-mono">
                {(["all", "douyin", "bilibili", "financial"] as const).map((tab) => (
                  <button
                    key={tab}
                    id={`platform-tab-${tab}`}
                    onClick={() => setSelectedPlatformTab(tab)}
                    type="button"
                    className={`flex-1 sm:flex-none px-3 py-1 text-[11px] font-bold uppercase transition ${
                      selectedPlatformTab === tab
                        ? "bg-[#1A1A1A] text-[#F5F5F0]"
                        : "text-neutral-500 hover:text-[#1A1A1A]"
                    }`}
                  >
                    {tab === "all" ? "全部对比" : tab === "douyin" ? "🎵 抖音" : tab === "bilibili" ? "📺 B站" : "📈 金融"}
                  </button>
                ))}
              </div>
            </div>

            {/* No outputs placeholder */}
            {!response && !loading && (
              <div className="py-20 px-4 text-center border-2 border-dashed border-[#1A1A1A]/30 flex flex-col items-center justify-center font-serif text-[#1A1A1A]">
                <div className="h-12 w-12 bg-[#F5F5F0] text-[#1A1A1A] border border-[#1A1A1A] flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold italic">暂无生成的策略矩阵</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto leading-relaxed font-sans">
                  请选择左侧实战分析示范，或手写大纲原件，随后提交右键处理模块以加载高级标题。
                </p>
              </div>
            )}

            {/* Generating progress state */}
            {loading && (
              <div className="py-24 text-center">
                <div className="inline-block relative h-10 w-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1A1A1A] opacity-30"></span>
                  <span className="relative inline-flex rounded-full h-10 w-10 bg-[#1A1A1A] flex items-center justify-center text-[#F5F5F0] text-xs font-bold font-mono">AI</span>
                </div>
                <h4 className="text-xs font-bold font-mono tracking-wider mt-4 uppercase animate-pulse">
                  Deploying Deep Models... / 大模型推理中
                </h4>
                <p className="text-[11px] text-neutral-500 mt-1.5 max-w-xs mx-auto leading-relaxed font-serif">
                  正在筛除红线、将宏大命题微观利己化、注入金融机构级“绞杀/重力锚”高能反差...
                </p>
              </div>
            )}

            {/* Generated results containers - REDESIGNED IN EDITORIAL THEME */}
            {response && !loading && (
              <div className="space-y-8 animate-fade-in">
                
                {/* 1. 🎵 抖音定向 (Douyin Flat Editorial Card List) */}
                {(selectedPlatformTab === "all" || selectedPlatformTab === "douyin") && response.douyin && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-red-650 border-[#1A1A1A] pb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-650 text-red-600 font-mono">
                        <Flame className="h-3.5 w-3.5" />
                        🎵 Douyin Reconstruction / 抖音定向 (痛点 • 利己 • 避险)
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">避开消极红线</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {response.douyin.map((option, index) => (
                        <div 
                          key={index} 
                          className="bg-white p-5 border border-[#1A1A1A] flex flex-col md:flex-row gap-5 items-start justify-between relative hover:shadow-[3px_3px_0px_#1a1a1a] transition-all"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-mono tracking-wider bg-[#F5F5F0] text-[#1A1A1A] border border-[#1A1A1A] px-1.5 py-0.2">
                                {option.appliedFormula || `Option ${index + 1}`}
                              </span>
                              <span className="text-[10px] text-red-600 font-mono">
                                封面限制: {option.coverText.length}/8字
                              </span>
                            </div>

                            <h3 className="text-lg font-bold leading-snug text-[#1A1A1A]">
                              {option.title}
                            </h3>

                            <div className="text-xs text-neutral-500 font-serif leading-relaxed p-3 bg-[#F5F5F0]/50 border-l-2 border-[#1A1A1A]">
                              <strong className="text-red-700 block text-[10px] uppercase tracking-wider font-mono mb-0.5">💡 Cognitive Hack / 痛点破局逻辑:</strong>
                              {option.rationale}
                            </div>
                          </div>

                          <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-dashed border-gray-200">
                            <button
                              type="button"
                              onClick={() => {
                                setCustomTitle(option.title);
                                setCustomCover(option.coverText);
                              }}
                              className="text-[10px] flex-1 md:w-28 py-2 bg-[#F5F5F0] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] font-bold uppercase transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ArrowRightLeft className="h-3 w-3" /> 输入沙盘
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopy(option.title, `dy-title-${index}`)}
                              className="text-[10px] px-2.5 py-2 border border-gray-300 hover:border-black text-[#1A1A1A] transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {copiedStates[`dy-title-${index}`] ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedStates[`dy-title-${index}`] ? "已复制" : "复制标题"}</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleCopy(option.coverText, `dy-cover-${index}`)}
                              className="text-[10px] px-2.5 py-2 border border-gray-300 hover:border-black text-[#1A1A1A] transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {copiedStates[`dy-cover-${index}`] ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedStates[`dy-cover-${index}`] ? "复制贴字" : "复制封面字"}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. 📺 B站定向 (Bilibili Specific Section) */}
                {(selectedPlatformTab === "all" || selectedPlatformTab === "bilibili") && response.bilibili && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between border-b-2 border-sky-600 border-[#1A1A1A] pb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-sky-700 font-mono">
                        <Tv className="h-3.5 w-3.5" />
                        📺 Bilibili Framework / B站定向 (硬核概念 • 学术降维 • 深度)
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">赋予智识优越感</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {response.bilibili.map((option, index) => (
                        <div 
                          key={index} 
                          className="bg-white p-5 border border-[#1A1A1A] flex flex-col md:flex-row gap-5 items-start justify-between relative hover:shadow-[3px_3px_0px_#1a1a1a] transition-all"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-mono tracking-wider bg-[#F5F5F0] text-[#1A1A1A] border border-[#1A1A1A] px-1.5 py-0.2">
                                {option.appliedFormula || `Option ${index + 1}`}
                              </span>
                              <span className="text-[10px] text-sky-700 font-mono">
                                封面限制: {option.coverText.length}/10字
                              </span>
                            </div>

                            <h3 className="text-lg font-serif italic font-bold leading-snug text-[#1A1A1A]">
                              {option.title}
                            </h3>

                            <div className="text-xs text-neutral-500 font-serif leading-relaxed p-3 bg-[#F5F5F0]/50 border-l-2 border-[#1A1A1A]">
                              <strong className="text-sky-700 block text-[10px] uppercase tracking-wider font-mono mb-0.5">🧠 Academic Framework / 学术拆解逻辑:</strong>
                              {option.rationale}
                            </div>
                          </div>

                          <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-dashed border-gray-200">
                            <button
                              type="button"
                              onClick={() => {
                                setCustomTitle(option.title);
                                setCustomCover(option.coverText);
                              }}
                              className="text-[10px] flex-1 md:w-28 py-2 bg-[#F5F5F0] hover:bg-[#1A1A1A] hover:text-white border border-[#1A1A1A] font-bold uppercase transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ArrowRightLeft className="h-3 w-3" /> 输入沙盘
                            </button>

                            <button
                              type="button"
                              id={`bb-title-btn-${index}`}
                              onClick={() => handleCopy(option.title, `bb-title-${index}`)}
                              className="text-[10px] px-2.5 py-2 border border-gray-300 hover:border-black text-[#1A1A1A] transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {copiedStates[`bb-title-${index}`] ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedStates[`bb-title-${index}`] ? "已复制" : "复制标题"}</span>
                            </button>
                            
                            <button
                              type="button"
                              id={`bb-cover-btn-${index}`}
                              onClick={() => handleCopy(option.coverText, `bb-cover-${index}`)}
                              className="text-[10px] px-2.5 py-2 border border-gray-300 hover:border-black text-[#1A1A1A] transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {copiedStates[`bb-cover-${index}`] ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedStates[`bb-cover-${index}`] ? "复制贴字" : "复制封面"}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. 📈 金融专业级 (Institutional / Financial Trader Style - FULL INVERSE PRO CARD) */}
                {(selectedPlatformTab === "all" || selectedPlatformTab === "financial") && response.financial && (
                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between border-b-2 border-emerald-600 border-[#1A1A1A] pb-1.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-700 font-mono">
                        <TrendingUp className="h-3.5 w-3.5" />
                        📈 Institutional Trader / 金融级绞杀套利 (核心矛盾 • 地地道道动作词)
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase">极端价差或扭曲</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {response.financial.map((option, index) => (
                        <div 
                          key={index} 
                          className="bg-[#1A1A1A] text-[#F5F5F0] p-5 border border-[#1A1A1A] flex flex-col md:flex-row gap-5 items-start justify-between relative hover:shadow-[3px_3px_0px_#333] transition-all"
                        >
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] uppercase font-mono tracking-widest bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2">
                                PRO {option.appliedFormula || `COMPOUND`}
                              </span>
                              <span className="text-[10px] text-orange-400 font-mono font-bold">
                                核心锚点: {option.coverText}
                              </span>
                            </div>

                            <h3 className="text-lg font-serif italic leading-snug text-white">
                              {option.title}
                            </h3>

                            <div className="text-xs text-neutral-300 font-serif leading-relaxed p-3 bg-white/5 border-l-2 border-orange-400">
                              <strong className="text-orange-400 block text-[10px] uppercase tracking-wider font-mono mb-0.5">📊 INSTITUTION DEVIATION / 机构套利推演:</strong>
                              {option.rationale}
                            </div>
                          </div>

                          <div className="flex md:flex-col gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-dashed border-white/10">
                            <button
                              type="button"
                              onClick={() => {
                                setCustomTitle(option.title);
                                setCustomCover(option.coverText);
                              }}
                              className="text-[10px] flex-1 md:w-28 py-2 bg-white text-[#1A1A1A] hover:bg-neutral-200 font-bold uppercase transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <ArrowRightLeft className="h-3 w-3" /> 输入沙盘
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopy(option.title, `fc-title-${index}`)}
                              className="text-[10px] px-2.5 py-2 border border-neutral-700 bg-neutral-900 text-white hover:border-white transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {copiedStates[`fc-title-${index}`] ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedStates[`fc-title-${index}`] ? "已复制" : "复制标题"}</span>
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => handleCopy(option.coverText, `fc-cover-${index}`)}
                              className="text-[10px] px-2.5 py-2 border border-neutral-700 bg-neutral-900 text-white hover:border-white transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              {copiedStates[`fc-cover-${index}`] ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                              <span>{copiedStates[`fc-cover-${index}`] ? "复制大字点" : "复制大字"}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Practical Live Mock Cover Playground Sandbox */}
          <div className="bg-white border border-[#1A1A1A] p-6 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#1A1A1A]"></div>
            
            <h3 className="text-xs uppercase font-bold tracking-tighter mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              IV. REAL-TIME COVER SANDBOX / 视频贴图即时封面微调沙盘
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Sandbox Details */}
              <div className="md:col-span-6 space-y-4 font-mono">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block uppercase">自定义修改标题</label>
                  <textarea
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    rows={2}
                    placeholder="可在此输入或微调看中的标题..."
                    className="w-full text-xs font-serif bg-[#F5F5F0]/40 border border-[#1A1A1A] p-2 focus:outline-hidden focus:bg-[#F5F5F0]/10"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-neutral-700 block flex justify-between uppercase">
                    <span>贴图封面大字 (实时投射到右侧实体模型)</span>
                    <span className="text-neutral-400 text-[10px]">
                      {customCover.length}字符
                    </span>
                  </label>
                  <input
                    type="text"
                    value={customCover}
                    onChange={(e) => setCustomCover(e.target.value)}
                    placeholder="如: 695元历史价差、极限绞杀、逃离中产"
                    className="w-full text-xs font-black bg-[#F5F5F0]/40 border border-[#1A1A1A] px-2.5 py-2 focus:outline-hidden"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(customTitle, "sandbox-title")}
                    type="button"
                    className="flex-1 py-2 px-2.5 bg-[#1A1A1A] hover:bg-[#333] text-white font-bold text-[10px] uppercase transition flex items-center justify-center gap-1"
                  >
                    {copiedStates["sandbox-title"] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedStates["sandbox-title"] ? "已复制" : "复制微调标题"}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(customCover, "sandbox-cover")}
                    type="button"
                    className="flex-1 py-2 px-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold text-[10px] border border-[#1A1A1A] uppercase transition flex items-center justify-center gap-1"
                  >
                    {copiedStates["sandbox-cover"] ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedStates["sandbox-cover"] ? "已复制" : "复制大字贴文"}</span>
                  </button>
                </div>
              </div>

              {/* Physical mockup side */}
              <div className="md:col-span-6 flex justify-center">
                <div className="relative border-4 border-[#1A1A1A] p-2 shadow-[4px_4px_0px_#1a1a1a] bg-white w-56 max-w-full">
                  <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-16 h-3 bg-[#1A1A1A] rounded-full z-20 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-slate-100"></span>
                  </div>
                  
                  {/* Mock content representation */}
                  <div className={`relative h-64 overflow-hidden flex flex-col justify-between py-6 px-4 z-10 transition duration-300 ${THEME_STYLES[coverTheme].bg}`}>
                    
                    {/* Top statistics mock text */}
                    <div className="flex justify-between items-center text-[7px] tracking-wider text-white/50 font-mono uppercase">
                      <span>{THEME_STYLES[coverTheme].badgeStyle}</span>
                      <span>HD ● LIVE</span>
                    </div>

                    {/* Massive bold headlines */}
                    <div className="text-center my-auto px-1 space-y-1.5 ">
                      <div className="inline-block w-4 h-0.5 bg-orange-400 mx-auto"></div>
                      <h2 className={`break-all leading-snug drop-shadow-md text-center text-white ${
                        customCover.length > 6 ? "text-base font-bold" : "text-lg font-black"
                      }`}>
                        {customCover || "大字封面预览"}
                      </h2>
                      <div className="inline-block w-4 h-0.5 bg-orange-400 mx-auto"></div>
                    </div>

                    {/* Bottom stats layout */}
                    <div className="space-y-1.5 bg-black/45 p-2 rounded-xs backdrop-blur-xs">
                      <p className="text-[8px] line-clamp-2 text-white/90 leading-relaxed text-left font-serif">
                        {customTitle || "生成的副标题将会在这边进行实况缩写渲染..."}
                      </p>
                      
                      <div className="flex justify-between items-center text-[6px] text-white/50 font-mono pt-1 border-t border-white/10">
                        <span>👥 ESTIMATE TRÈND: 94.2%</span>
                        <span>👍 STRATEGY: HIGHEST</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>

        </section>
      </main>

      {/* Editorial Footer */}
      <footer className="max-w-7xl mx-auto py-12 px-6 border-t border-[#1A1A1A] mt-16 flex flex-col sm:flex-row justify-between items-center text-[10px] uppercase tracking-widest opacity-60 font-mono gap-4">
        <div className="flex flex-wrap justify-center sm:justify-start gap-6">
          <span>Target Platform: Douyin, Bilibili, Financial Pro</span>
          <span>Success Rate: 99.1%</span>
          <span>Engine: Gemini-3.5-Flash Live</span>
        </div>
        <div>© 2026 MATRIX HEADLINES & FIN-VIRTUE ANALYTICS</div>
      </footer>
    </div>
  );
}
