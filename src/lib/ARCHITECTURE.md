# System Architecture: K-Beauty Trend Insight Agent

## 1. Problem Definition
The Product Engineer role requires translating business needs into technical solutions. In the K-Beauty context, the problem is:
> "How can we transform vast amounts of external market data and internal sales data into actionable business strategies automatically?"

## 2. Technical Structuring
We decompose this problem into four distinct layers:

### A. Data Layer (Ingestion)
- **External Trends**: Mocked Google Search/SNS trend data by country and category.
- **Internal Performance**: Sales revenue and inventory levels mapped by product keywords.
- **External Factors**: Real-time FX rates to adjust revenue potential.

### B. Logic Layer (Integration)
- **Opportunity Scoring**: A weighted algorithm that combines growth trajectory, current popularity, and FX favorability.
- **Formula**: `(Growth * 0.4) + (Score * 0.3) + (FX_Favorability) + (Inventory_Level_Bonus)`

### C. Agent Layer (Intelligence)
- **LLM Agent**: A reasoning engine that interprets the "Opportunity Score" and provides natural language rationales.
- **Rationale Generator**: Context-aware explanations that justify why a specific product or keyword is a priority.

### D. Presentation Layer (Delivery)
- **Responsive Dashboard**: Next.js 15 based UI for executive decision making.
- **Feedback Loop**: Integrated UI components to collect user feedback on AI insights, enabling iterative model improvement.

## 3. Data Flow
1. `getTrendsData` & `getInternalSales` -> Raw Data
2. `getMappedInsights` -> Integration & Scoring
3. `getAgentInsights` -> LLM Analysis & Rationale
4. Dashboard UI -> User Feedback -> Loop back to Agent refinement## 4. Dynamic Contextual Routing
- **Pattern**: `[country]/[category]/[keyword]` based routing.
- **Benefit**: Enables a scalable architecture where one analytics engine can serve infinite product/market combinations by pulling relevant "Rationales" on demand.
- **Product Depth**: Moving from a flat dashboard to a deep analysis tool demonstrates the "Technical Structuring" required to solve high-order business problems.
