import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK lazily to avoid crashing on missing key in startup checks.
let aiClient: GoogleGenAI | null = null;
function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not configured. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint to generate content
app.post("/api/generate-titles", async (req, res) => {
  try {
    const { content, extraKeywords, macroTrigger, extData, userFocus } = req.body;

    if (!content || content.trim() === "") {
      res.status(400).json({ error: "请输入需要生成标题的内容草稿、大纲或素材。" });
      return;
    }

    const ai = getAiClient();

    const systemInstruction = `你是一位顶级、资深的跨平台短视频爆款标题与封面大字生成专家，精通金融专业、抖音、B站等不同生态的文案调性与算法推荐机制。
请阅读用户输入的内容、背景、关键词等，生成三套完全不同风格的标题定向方案。

平台与风格规则细节如下：

一、专业交易/金融级定向（专业重构/期货交易组）：
1. 规则一：暴露“核心矛盾”或“定价扭曲”。不要平庸叙述，要把多空博弈、不合理点、关税、差价等摆出来。
2. 规则二：前置宏观/地缘“触发剂”。如地缘冲突、宏观决议等作为第一视觉焦点，再跟上具体品种冲击。
3. 规则三：提取精确的“核心数据”作为视觉锚点。使用真实的贴水、差价、仓单量、基差（可在输入内容中寻找，如果没有，生成合理比例的、契合逻辑的示范核心数字）。
4. 规则四：使用机构级、极具专业度的“动作词汇”（如：“绞杀”代替“下跌”、“重力锚”代替“支撑”、“溢价/贴水”代替“涨/跌”、“流动性抽离”代替“没钱了”、“库存拐点逼近”等）。
5. 标题公式：【核心标的/事件】+【极端现象/核心数据】+【推演逻辑/动作指令】
样例：
- “豆粕与玉米价差持续背离：关税落地后的左侧交易窗口验证”
- “霍尔木兹海峡地缘博弈升级：原油及燃料油跨期套利的底层推演逻辑”
- “仓单压制下的定价扭曲：红枣期限结构撕裂出的695元跨期价差”
- “PTA与玻璃库存拐点逼近：跨期套利建仓的真实安全边际测算”

二、🎵 抖音定向方案（极致吸引/认知反转/合规破局）：
1. 核心属性：痛点、敏锐、认知反转、利己、高度合规。
2. 注意红线：绝对禁用“阶层固化、剥削、绝望、焊死、底层”等消极词汇。将宏大问题巧妙降维为对普通人具有“破局意义”和“避坑、搞钱、求生”的方法论。
3. 标题公式：
   - 公式A：【大众错觉/痛点】+【残酷现实/认知反转】+【破局出路】
   - 公式B：【特定人群】+【宏观现象的微观投射】+【利己价值（搞钱/避险）】
4. 封面大字：极具悬念/情绪的短句，必须极其醒目并引发好奇，不超过8个汉字。

三、📺 B站定向方案（硬核/硬科普/学术降维/深度拆解）：
1. 核心属性：硬核结构拆解、宏观推演。热衷学术框架、数据探讨、客观深入、给普通人智力优越感。
2. 注意红线：警惕直接的政治煽动，带入学术概念（如博弈论、边际效应、沉没成本等结构化模型）。
3. 标题公式：
   - 公式A：【核心专业概念】+【极端现象复盘】+【终极拷问】
   - 公式B：【万物皆可深度拆解】+ 从【特定数据/结构】看【真实底座】
4. 封面大字：带有专业词汇/灵魂拷问的深度短句，不超过10个汉字。

请从输入中智能提取信息：
- 用户给出的宏观触发剂：${macroTrigger || "自动提取物"}
- 用户给出的核心数据：${extData || "自动提炼数据"}
- 额外指定的偏好：${extraKeywords || "无特别指定"}
- 用户人群定位：${userFocus || "大众/高净值"}

请严格遵循这些规则，产出符合 JSON 模式的标题包方案。严格遵循字数限制和逻辑。`;

    const modelInput = `生成这三种完全不同流派的标题与封面：
【原始素材】：
${content}

【补充宏观/数据输入（可选）】：
- 聚焦宏观事件: ${macroTrigger || "无"}
- 聚焦核心数据/数字: ${extData || "无"}
- 额外标签/关键词: ${extraKeywords || "无"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: modelInput,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["douyin", "bilibili", "financial"],
          properties: {
            douyin: {
              type: Type.ARRAY,
              description: "抖音推荐的3套爆款方案",
              items: {
                type: Type.OBJECT,
                required: ["title", "coverText", "appliedFormula", "rationale"],
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "符合抖音极致痛点、避坑搞钱与反转的标题，不包含红线禁用词汇"
                  },
                  coverText: {
                    type: Type.STRING,
                    description: "抖音视频封面贴图大字（极具悬念或情绪，绝不超过8个字）"
                  },
                  appliedFormula: {
                    type: Type.STRING,
                    description: "对应使用的抖音公式标识（例如：公式A、公式B）"
                  },
                  rationale: {
                    type: Type.STRING,
                    description: "此条标题如何通过利益化和反转避开红线击中抖音用户痛点的深度分析"
                  }
                }
              }
            },
            bilibili: {
              type: Type.ARRAY,
              description: "B站推荐的3套硬核学术/深度方案",
              items: {
                type: Type.OBJECT,
                required: ["title", "coverText", "appliedFormula", "rationale"],
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "符合B站深度探讨、带有学术降维或结构性推演的硬核标题"
                  },
                  coverText: {
                    type: Type.STRING,
                    description: "B站视频封面贴图大字（带专业度/灵魂质问，绝不超过10个字）"
                  },
                  appliedFormula: {
                    type: Type.STRING,
                    description: "对应使用的B站公式标识（例如：公式A、公式B）"
                  },
                  rationale: {
                    type: Type.STRING,
                    description: "此条标题体现了什么核心学术框架、深度数据或智力优越感分析"
                  }
                }
              }
            },
            financial: {
              type: Type.ARRAY,
              description: "金融/期货交易员专业级爆款方案",
              items: {
                type: Type.OBJECT,
                required: ["title", "coverText", "appliedFormula", "rationale"],
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "遵循交易员规则1-4及【核心标的/事件】+【极端现象/核心数据】+【推演逻辑/动作指令】公式的标题"
                  },
                  coverText: {
                    type: Type.STRING,
                    description: "交易级封面大字或核心数据锚（例如 695元价差、左侧窗口 极其具有专业度，不超过10个字）"
                  },
                  appliedFormula: {
                    type: Type.STRING,
                    description: "对应的专业重构指标（如：核心矛盾点+核心数据）"
                  },
                  rationale: {
                    type: Type.STRING,
                    description: "说明如何运用了具体的机构动作词（如“绞杀”、”流动性抽离“）及地缘触发因子的推演逻辑"
                  }
                }
              }
            }
          }
        }
      }
    });

    const responseText = response.text;
    res.json(JSON.parse(responseText.trim()));
  } catch (error: any) {
    console.error("Generate titles error:", error);
    res.status(500).json({ error: error.message || "生成标题方案时发生内部错误，请检查您的 API 配置。" });
  }
});

// Serve frontend assets
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
