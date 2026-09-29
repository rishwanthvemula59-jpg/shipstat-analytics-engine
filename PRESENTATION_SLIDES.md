# 🚢 ShipStat: E-Commerce Delivery Analytics Engine
## 25-Slide Comprehensive Presentation Deck

> **Team Size:** 6 Members (~4 slides per member)  
> **Style:** Clean, bite-sized bullet chunks, plain English, maximum clarity, high mathematical precision.

---

### 👥 Team Presentation Allocation Guide (6 Members)
- **Member 1 (Intro & Architecture):** Slides 1 – 4 (Welcome, Problem, What is ShipStat, Tech Stack)
- **Member 2 (Simulation & Pipeline):** Slides 5 – 8 (Mathematical Architecture, Simulation Engine, Stage Modeling, Uncertainty Variables)
- **Member 3 (Descriptive Statistics):** Slides 9 – 12 (Central Tendency, Spread/Variance, Skewness/Kurtosis, Frequency & Ogive)
- **Member 4 (Probability & Bayes):** Slides 13 – 16 (SLA Risk, Conditional Probability, Bayes' Theorem, Confidence Intervals)
- **Member 5 (Correlation & Regression):** Slides 17 – 20 (Pearson Correlation, Simple OLS, Multiple Regression, What-If Predictor)
- **Member 6 (Hypothesis, Impact & Conclusion):** Slides 21 – 25 (Welch's t-Test, Decision Rules, Key Insights, Live Demo, Thank You)

---

# Slide 1: Welcome & Title Slide
### Speaker: Member 1

#### Slide Content:
- **Title:** 🚢 **ShipStat**
- **Subtitle:** *E-Commerce Delivery Analytics Engine*
- **Theme:** Applied Probability, Stochastic Simulation & Statistical Inference
- **Team:** [Your Group Name / LG-13]
  - Member 1: [Name] (Project Overview & Tech Stack)
  - Member 2: [Name] (Monte Carlo Simulation Engine)
  - Member 3: [Name] (Descriptive Statistics & Continuous Distributions)
  - Member 4: [Name] (Conditional Probability & Bayes' Law)
  - Member 5: [Name] (Correlation & Linear Regression Models)
  - Member 6: [Name] (Hypothesis Testing, Insights & Conclusion)

> **Speaker Note:**  
> "Good morning everyone. Today we are excited to present **ShipStat**, an analytical simulation engine that uses probability, statistics, and machine-learning fundamentals to understand, predict, and optimize e-commerce delivery logistics."

---

# Slide 2: The Real-World Problem
### Speaker: Member 1

#### Slide Content:
* **The Core Challenge:**
  - Modern e-commerce promises 1-day or 2-day delivery.
  - In reality, transit is unpredictable.
* **Why Delivery Times Fluctuate:**
  - 🌧️ Weather surprises (rainstorms, road blocks).
  - 📏 Distance & route friction.
  - 📦 Warehouse processing bottlenecks.
  - ⚡ Fulfillment priority (Standard vs Express).
* **The Business Question:**
  - Can we use pure mathematics to predict late deliveries before they happen?

> **Speaker Note:**  
> "When you buy an item online, a delivery estimate is given. But behind that estimate is massive uncertainty: warehouse lag, weather events, and traffic. Our project answers: how can companies model this uncertainty mathematically rather than just guessing?"

---

# Slide 3: What is ShipStat?
### Speaker: Member 1

#### Slide Content:
* **Not Just a Tracking App:**
  - ShipStat is an **Applied Mathematics & Statistics Engine**.
* **What it Does:**
  - **Simulates:** Generates thousands of hypothetical delivery orders using real probability distributions.
  - **Measures:** Calculates mean, variance, percentiles, and skewness of transit durations.
  - **Infers:** Computes the probability of SLA failure under extreme weather.
  - **Models:** Uses Simple & Multiple Linear Regression to predict delivery hours.
  - **Tests:** Performs formal two-sample hypothesis testing to prove whether Express delivery actually saves time.

> **Speaker Note:**  
> "ShipStat is not a standard CRUD web app. It is a mathematical laboratory. It synthesizes thousands of orders under controlled random variables, runs descriptive statistics, computes conditional probabilities, and validates operational decisions with hypothesis testing."

---

# Slide 4: Technology Stack & Architecture
### Speaker: Member 1

#### Slide Content:
* **Frontend Architecture:**
  - **React 19 + TypeScript:** Type-safe UI, reactive state, component modularity.
  - **Vite:** High-performance ES modules bundler.
  - **Vanilla CSS Glassmorphism:** Custom dark-mode design system with responsive layouts.
* **Analytics & Math Engine:**
  - **Pure TypeScript Engine:** Custom statistical formulas implemented from scratch (Box-Muller, OLS matrices, Welch t-test).
* **Visualizations:**
  - **Recharts:** Interactive density curves, scatter plots, and histograms.
* **Hosting & DevOps:**
  - **GitHub Pages:** Automated single-command deployment.

> **Speaker Note:**  
> "To give users a fast and clean experience, we built the entire solution in TypeScript using React and Vite. All statistical engines—from Box-Muller normal sampling to matrix-based multiple regression—were implemented in pure TypeScript without heavy third-party backends."

---

# Slide 5: The Mathematical Pipeline
### Speaker: Member 2

#### Slide Content:
* **The 5-Stage Life Cycle of a Delivery:**
  - Every order follows a sequence of 5 independent and dependent stages:
$$\text{Total Time } (T) = T_{\text{proc}} + T_{\text{pack}} + T_{\text{transit}} + T_{\text{last\_mile}} + D_{\text{weather}}$$
* **Breakdown:**
  1. $T_{\text{proc}}$: Warehouse order verification.
  2. $T_{\text{pack}}$: Picking, packing & palletizing.
  3. $T_{\text{transit}}$: Highway freight transfer (distance-dependent).
  4. $T_{\text{last\_mile}}$: Local hub delivery to customer doorstep.
  5. $D_{\text{weather}}$: Stochastic weather delay penalty.

> **Speaker Note:**  
> "Now let's examine the math behind how an order travels. Total delivery time is not a single random number. It is the sum of five distinct operational phases, each governed by its own probabilistic distribution."

---

# Slide 6: The Monte Carlo Simulation Engine
### Speaker: Member 2

#### Slide Content:
* **Why Monte Carlo Simulation?**
  - Real-world logistics data is proprietary and hard to obtain.
  - Monte Carlo lets us generate thousands of valid delivery outcomes using probability theory.
* **Deterministic Pseudo-Random Generator (PRNG):**
  - **Algorithm:** Mulberry32 PRNG.
  - **Benefit:** Same seed (e.g., `seed = 42`) generates the exact same numbers for reproducibility.
* **Scale:**
  - Default run generates **2,000 orders** in < 15 milliseconds.

> **Speaker Note:**  
> "We used Monte Carlo simulation powered by a seeded Mulberry32 pseudo-random number generator. This gives us full scientific reproducibility: anyone running the dashboard with seed 42 will see the exact same statistical outputs."

---

# Slide 7: Probability Distributions Used
### Speaker: Member 2

#### Slide Content:
* **1. Normal Distribution ($\mathcal{N}(\mu, \sigma^2)$):**
  - Used for: Processing time & Last-Mile delivery.
  - Generated via: **Box-Muller Transform**:
$$Z = \sqrt{-2\ln(U_1)} \cos(2\pi U_2)$$
* **2. Continuous Uniform Distribution ($\mathcal{U}(a, b)$):**
  - Used for: Packing duration & transit distances ($5 \text{ km}$ to $100 \text{ km}$).
* **3. Exponential Distribution ($\text{Exp}(\lambda)$):**
  - Used for: Random rain and storm delays.
  - Formula: $x = -\frac{1}{\lambda} \ln(U)$.
  - Captures rare but severe disruption spikes (long right tail).

> **Speaker Note:**  
> "Different operational events behave differently. Routine warehouse packing follows a Uniform distribution. Transit friction follows a Gaussian Normal curve via the Box-Muller transform. And unexpected weather delays follow an Exponential distribution because severe delays are rare but catastrophic."

---

# Slide 8: Defining SLA & The "Late" Event
### Speaker: Member 2

#### Slide Content:
* **What is SLA (Service Level Agreement)?**
  - The promised delivery window given to the customer.
* **Nominal SLA Formulas:**
  - **Standard Tier:**
$$\text{SLA}_{\text{std}} = \text{Base} + (0.48 \times \text{Distance}) + 2.5\text{ hr buffer}$$
  - **Express Tier:**
$$\text{SLA}_{\text{exp}} = \text{Base} + (0.34 \times \text{Distance}) + 1.8\text{ hr buffer}$$
* **Mathematical Definition of a Failure:**
$$\text{Status} = \begin{cases} \text{Late}, & \text{if } T_{\text{actual}} > \text{SLA} \\ \text{On-Time}, & \text{otherwise} \end{cases}$$

> **Speaker Note:**  
> "To know whether an order is late, we mathematically define the SLA threshold. Express orders receive faster transit coefficients and tighter buffers. If actual transit exceeds the SLA threshold, the order is classified as Late."

---

# Slide 9: Descriptive Statistics (Central Tendency)
### Speaker: Member 3

#### Slide Content:
* **Measures of Central Tendency:**
  - **Sample Mean ($\bar{x}$):**
$$\bar{x} = \frac{1}{n} \sum_{i=1}^n x_i \approx 31.8\text{ hours}$$
  - **Median ($Q_2$):**
$$\text{Median} = \text{Value at 50th percentile} \approx 30.5\text{ hours}$$
  - **Mode:**
$$\text{Mode} = \text{Peak class midpoint} \approx 28.0\text{ hours}$$
* **Key Mathematical Insight:**
  - Since $\text{Mean} > \text{Median} > \text{Mode}$, the delivery distribution is **positively skewed**.

> **Speaker Note:**  
> "Turning to descriptive statistics: our sample mean is roughly 31.8 hours, while the median is 30.5 hours. Because the mean is greater than the median, we immediately know there is a right-hand tail created by heavy weather delays."

---

# Slide 10: Measures of Dispersion & Variability
### Speaker: Member 3

#### Slide Content:
* **Sample Variance ($s^2$):**
$$s^2 = \frac{1}{n-1} \sum_{i=1}^n (x_i - \bar{x})^2 \approx 185.4\text{ hours}^2$$
* **Sample Standard Deviation ($s$):**
$$s = \sqrt{s^2} \approx 13.6\text{ hours}$$
* **Interquartile Range ($\text{IQR}$):**
$$\text{IQR} = Q_3 - Q_1 = 40.2 - 21.8 = 18.4\text{ hours}$$
* **Coefficient of Variation ($\text{CV}$):**
$$\text{CV} = \frac{s}{\bar{x}} \times 100 \approx 42.8\%$$
  - Indicates moderate relative variability in fulfillment transit.

> **Speaker Note:**  
> "Variance and standard deviation measure how much deliveries fluctuate. An IQR of 18.4 hours means the middle 50% of all customer deliveries fall within an 18-hour spread. The Coefficient of Variation is 42.8%, showing operational variability."

---

# Slide 11: Distribution Shape: Skewness & Kurtosis
### Speaker: Member 3

#### Slide Content:
* **Fisher-Pearson Skewness ($g_1$):**
$$g_1 = \frac{n}{(n-1)(n-2)} \sum_{i=1}^n \left( \frac{x_i - \bar{x}}{s} \right)^3 \approx +0.48$$
  - **Interpretation:** Positive skew. Most orders arrive quickly, but extreme delays pull the tail to the right.
* **Sample Excess Kurtosis ($g_2$):**
$$g_2 = \frac{n(n+1)}{(n-1)(n-2)(n-3)} \sum_{i=1}^n \left( \frac{x_i - \bar{x}}{s} \right)^4 - \frac{3(n-1)^2}{(n-2)(n-3)} \approx +0.12$$
  - **Interpretation:** Mildly leptokurtic; slight presence of fat tails due to storms.

> **Speaker Note:**  
> "Skewness measures asymmetry. A skewness of +0.48 confirms a distinct right-side tail. Kurtosis measures tail heaviness, confirming that storms produce rare but extreme outliers."

---

# Slide 12: Grouped Frequency Table & Ogive
### Speaker: Member 3

#### Slide Content:
* **Grouping Continuous Data into Intervals:**
  - Continuous delivery hours grouped into 12 equal bins.
  - Calculated: Class limits, Midpoint ($x$), Frequency ($f$), Relative frequency ($f/n$).
* **Cumulative Relative Frequency (The Ogive):**
$$F(x) = P(X \le x) = \sum_{t \le x} \frac{f_t}{n}$$
* **Practical Utility:**
  - Readily answers questions like: *"What percentage of orders arrive in less than 35 hours?"* (~68%).

> **Speaker Note:**  
> "By binning continuous times into a grouped frequency table, we construct the cumulative ogive curve. This curve represents the empirical CDF, allowing warehouse operators to instantly read off SLA percentiles."

---

# Slide 13: Probability & SLA Risk Analysis
### Speaker: Member 4

#### Slide Content:
* **1. Marginal Probability of Failure:**
$$P(\text{Late}) = \frac{N_{\text{late}}}{N_{\text{total}}} \approx 13.5\%$$
* **2. SLA Compliance Rate:**
$$P(\text{On-Time}) = 1 - P(\text{Late}) \approx 86.5\%$$
* **3. Operational Interpretation:**
  - Under normal baseline conditions, about 86 to 87 out of every 100 packages arrive on schedule.
  - 13.5% breach the promised delivery deadline.

> **Speaker Note:**  
> "Now let us examine probability theory. Across all simulated deliveries, the unconditional probability of a late package is approximately 13.5%, meaning the business operates at an 86.5% overall SLA compliance rate."

---

# Slide 14: Conditional Probability of Delays
### Speaker: Member 4

#### Slide Content:
* **Definition of Conditional Probability:**
$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$
* **Impact of Weather on Late Deliveries:**
  - $P(\text{Late} \mid \text{Normal}) \approx \mathbf{6.2\%}$ (Baseline risk)
  - $P(\text{Late} \mid \text{Rain}) \approx \mathbf{19.8\%}$ (3.2x increase)
  - $P(\text{Late} \mid \text{Storm}) \approx \mathbf{51.4\%}$ (Over half are late!)
* **Key Finding:**
  - Severe weather causes an **8-fold increase** in the probability of delivery failure.

> **Speaker Note:**  
> "Conditional probability shows the real operational risk. If the weather is normal, only 6% of orders fail. But if there is a storm, the failure probability jumps to over 51%. Weather is the primary cause of delivery failure."

---

# Slide 15: Inverting Probability: Bayes' Theorem
### Speaker: Member 4

#### Slide Content:
* **The Diagnostic Question:**
  - *"A customer calls angrily saying their package is late. What is the probability it was delayed by a storm?"*
* **Bayes' Formula:**
$$P(\text{Storm} \mid \text{Late}) = \frac{P(\text{Late} \mid \text{Storm}) \cdot P(\text{Storm})}{P(\text{Late})}$$
* **Calculation:**
$$P(\text{Storm} \mid \text{Late}) = \frac{0.514 \times 0.10}{0.135} \approx \mathbf{38.1\%}$$
* **Insight:**
  - Even though storms happen only 10% of the time, they account for almost **40% of all late packages**.

> **Speaker Note:**  
> "Bayes' Theorem lets us reason backward. If a customer reports a late package, there is a 38% probability that a storm caused it, even though storms occur on only 10% of total days."

---

# Slide 16: Confidence Intervals on Mean Delivery Time
### Speaker: Member 4

#### Slide Content:
* **Why Confidence Intervals?**
  - Sample mean $\bar{x}$ has sampling error. We need a range where the true population mean $\mu$ lies.
* **Formula (Student's t-Distribution, $95\%$ Confidence):**
$$\text{CI}_{95\%} = \bar{x} \pm t_{\alpha/2, \, n-1} \cdot \left(\frac{s}{\sqrt{n}}\right)$$
* **Numerical Results ($n = 2,000$):**
  - Standard Error ($\text{SE}$): $\frac{13.6}{\sqrt{2000}} = 0.304\text{ hours}$
  - Critical $t^*$: $t_{0.025, 1999} \approx 1.961$
  - Margin of Error ($\text{ME}$): $\pm 0.60\text{ hours}$
  - **95% Confidence Interval:** $[31.2\text{ hr}, \, 32.4\text{ hr}]$

> **Speaker Note:**  
> "Using the Student's t-distribution with 1,999 degrees of freedom, our 95% confidence interval for mean delivery time is 31.2 to 32.4 hours. We are 95% confident the true average delivery duration falls in this narrow window."

---

# Slide 17: Correlation Analysis (Pearson $r$)
### Speaker: Member 5

#### Slide Content:
* **Research Question:**
  - How strongly is delivery distance connected to transit duration?
* **Pearson Correlation Coefficient Formula:**
$$r = \frac{\sum_{i=1}^n (x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^n (x_i - \bar{x})^2 \sum_{i=1}^n (y_i - \bar{y})^2}} \approx \mathbf{+0.88}$$
* **Coefficient of Determination ($r^2$):**
$$r^2 = (0.88)^2 \approx \mathbf{0.774} \quad (77.4\%)$$
* **Conclusion:**
  - Very strong positive linear relationship.
  - 77.4% of total delivery time variation is explained by transit distance alone.

> **Speaker Note:**  
> "Moving to correlation: we obtained a Pearson correlation coefficient of +0.88 between distance and total delivery time. This strong positive value proves distance is the single largest linear driver of transit duration."

---

# Slide 18: Simple Linear Regression Model
### Speaker: Member 5

#### Slide Content:
* **Model Equation:**
$$Y = \beta_0 + \beta_1 X + \varepsilon$$
* **Ordinary Least Squares (OLS) Estimators:**
$$\hat{\beta}_1 = \frac{\sum (X - \bar{X})(Y - \bar{Y})}{\sum (X - \bar{X})^2} \approx \mathbf{0.412} \quad (\text{Slope})$$
$$\hat{\beta}_0 = \bar{Y} - \hat{\beta}_1 \bar{X} \approx \mathbf{10.25} \quad (\text{Intercept})$$
* **Fitted Prediction Equation:**
$$\widehat{\text{Delivery Time}} = 10.25 + 0.412 \times (\text{Distance in km})$$
* **Interpretation:**
  - Baseline fixed processing overhead = **10.25 hours**.
  - Each additional kilometer adds **0.412 hours** (~25 minutes).

> **Speaker Note:**  
> "Using Ordinary Least Squares, our simple linear regression equation is: Delivery Time = 10.25 + 0.412 times Distance. The intercept represents our fixed warehouse overhead, and the slope represents the travel time per kilometer."

---

# Slide 19: Multiple Linear Regression (MLR)
### Speaker: Member 5

#### Slide Content:
* **Why Multiple Regression?**
  - Simple regression ignores weather and service tier. MLR controls for all factors simultaneously.
* **Full Multi-Variable Model:**
$$Y = \beta_0 + \beta_1 (\text{Dist}) + \beta_2 (\text{WeatherDelay}) + \beta_3 (\text{Processing}) + \beta_4 (\text{IsExpress}) + \varepsilon$$
* **Solved Matrix Coefficients (Normal Equations: $\boldsymbol{\beta} = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\mathbf{Y}$):**
  - $\beta_1$ (Distance): $+0.41 \text{ hr/km}$
  - $\beta_2$ (Weather Delay): $+1.00 \text{ hr/hr}$ (1:1 pass-through)
  - $\beta_3$ (Processing): $+0.99 \text{ hr/hr}$
  - $\beta_4$ (Express Tier Dummy): $\mathbf{-4.65 \text{ hours}}$
* **Model Fit:** $R^2 \approx \mathbf{96.2\%}$, $F\text{-statistic} > 12,000$ ($p < 0.0001$).

> **Speaker Note:**  
> "To capture the complete picture, we built a Multiple Linear Regression model using matrix algebra. Controlling for distance, processing time, and weather delays, selecting Express delivery saves an average of 4.65 hours."

---

# Slide 20: Interactive "What-If" Predictor
### Speaker: Member 5

#### Slide Content:
* **Dynamic Scenario Forecasting:**
  - Operators select: **Distance (km)**, **Delivery Tier**, and **Weather Forecast**.
* **What the Algorithm Calculates in Real Time:**
  1. Predicted duration via MLR equation.
  2. SLA threshold comparison.
  3. Risk classification:
     - 🟢 **Low Risk:** Delivery time safely under SLA target.
     - 🟡 **Moderate Risk:** Within 1 hour of breach.
     - 🔴 **High Risk:** Projected to fail delivery deadline.
* **Business Benefit:**
  - Dynamic route adjustments and proactive customer notifications before dispatch.

> **Speaker Note:**  
> "We integrated this model into an interactive What-If delivery predictor on the dashboard. Dispatchers can adjust distance, tier, and forecasted weather to see predicted arrival times and risk classifications in real time."

---

# Slide 21: Hypothesis Testing: Research Setup
### Speaker: Member 6

#### Slide Content:
* **Managerial Question:**
  - *"Does Express fulfillment actually save delivery time compared to Standard fulfillment?"*
* **Formulating the Hypotheses:**
  - **Null Hypothesis ($H_0$):**
$$H_0: \mu_{\text{Express}} \ge \mu_{\text{Standard}}$$
    *(Express does not reduce delivery time; difference is due to chance)*
  - **Alternative Hypothesis ($H_1$):**
$$H_1: \mu_{\text{Express}} < \mu_{\text{Standard}} \quad \text{(One-Tailed Left Test)}$$
* **Significance Level ($\alpha$):**
$$\alpha = 0.05 \quad (95\% \text{ confidence})$$

> **Speaker Note:**  
> "To validate our findings with scientific rigor, we conducted formal hypothesis testing. We tested whether Express fulfillment significantly reduces delivery times compared to Standard fulfillment, using a one-tailed test with an alpha of 0.05."

---

# Slide 22: Welch's Two-Sample $t$-Test
### Speaker: Member 6

#### Slide Content:
* **Why Welch's $t$-Test instead of Student's $t$-Test?**
  - Variances and sample sizes are unequal ($\sigma_1^2 \ne \sigma_2^2$, $n_1 \ne n_2$).
* **Welch's $t$-Statistic Formula:**
$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$
* **Welch–Satterthwaite Degrees of Freedom ($\nu$):**
$$\nu = \frac{\left( \frac{s_1^2}{n_1} + \frac{s_2^2}{n_2} \right)^2}{\frac{(s_1^2/n_1)^2}{n_1 - 1} + \frac{(s_2^2/n_2)^2}{n_2 - 1}} \approx 1,280.4$$

> **Speaker Note:**  
> "We used Welch's two-sample t-test because the Express and Standard groups have unequal variances and sample sizes. The Welch-Satterthwaite equation gives us approximately 1,280 degrees of freedom."

---

# Slide 23: Test Results & Effect Size
### Speaker: Member 6

#### Slide Content:
* **Statistical Values Computed:**
  - Express Sample Mean ($\bar{x}_1$): **25.2 hr** ($n_1 = 600$)
  - Standard Sample Mean ($\bar{x}_2$): **34.6 hr** ($n_2 = 1,400$)
  - Observed $t$-statistic: **$t = -15.82$**
  - Critical $t^*$-threshold ($\alpha = 0.05$): **$t^* = -1.646$**
  - $p$-value: **$p \approx 1.2 \times 10^{-51} \lll 0.05$**
* **Effect Size (Cohen's $d$):**
$$d = \frac{\bar{x}_1 - \bar{x}_2}{s_{\text{pooled}}} \approx \mathbf{-0.72} \quad (\text{Moderate-to-Large Effect})$$
* **Statistical Decision:**
  - **Reject $H_0$** in favor of $H_1$.

> **Speaker Note:**  
> "Our observed t-statistic was -15.82, far beyond the critical cutoff of -1.646. The p-value is effectively zero, and Cohen's d is -0.72. We decisively reject the null hypothesis: Express delivery delivers a statistically significant 9.4-hour time savings."

---

# Slide 24: Key Takeaways & Live Dashboard
### Speaker: Member 6

#### Slide Content:
* **Summary of Discoveries:**
  1. **Weather is the biggest risk driver:** Storms increase delivery failure by over 800%.
  2. **Distance is highly predictable:** Linear correlation of $r = 0.88$ explains 77% of transit variance.
  3. **Express delivers on its promise:** Confirmed with $p < 10^{-50}$ and average savings of 9.4 hours.
* **Project Artifacts:**
  - 🌐 **Live Web Application:** [https://rishwanthvemula59-jpg.github.io/shipstat-analytics-engine/](https://rishwanthvemula59-jpg.github.io/shipstat-analytics-engine/)
  - 💻 **Open-Source Code:** [https://github.com/rishwanthvemula59-jpg/shipstat-analytics-engine](https://github.com/rishwanthvemula59-jpg/shipstat-analytics-engine)

> **Speaker Note:**  
> "In summary: storms are the primary cause of delivery failures, distance provides a strong linear baseline, and Express shipping delivers verified, measurable time savings. Our live web app is deployed and accessible online."

---

# Slide 25: Thank You & Q&A
### Speaker: All Team Members

#### Slide Content:
* **Thank You!**
* **Project:** 🚢 ShipStat — E-Commerce Delivery Analytics Engine
* **Presented by Group LG-13:**
  - Member 1: [Name] | Member 2: [Name]
  - Member 3: [Name] | Member 4: [Name]
  - Member 5: [Name] | Member 6: [Name]
* **We welcome any questions from the panel!**
  - *Topic suggestions: Monte Carlo distributions, Bayes' inversions, regression residuals, or Welch t-test assumptions.*

> **Speaker Note:**  
> "Thank you very much for your time and attention. We would now love to open the floor to any questions about our mathematical modeling, probability methods, or code implementation."
