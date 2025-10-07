"use client";

import { Moon, PiggyBank, Sun, TrendingUp } from "lucide-react";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { BlurFade } from "@/components/animated/BlurFade";
import { UnderlineGrow } from "@/components/animated/UnderlineGrow";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { BLUR_FADE_DELAY } from "@/constants/ui";

type YearlyData = { year: number; amount: number; invested: number };

export default function ReturnCalculator() {
	const [investmentType, setInvestmentType] = useState<"sip" | "lumpsum">("lumpsum");

	// Lump sum parameters
	const [lsYears, setLsYears] = useState(5);
	const [lsAmount, setLsAmount] = useState(5000);
	const [lsReturnRate, setLsReturnRate] = useState(10);
	const [lsYearlyData, setLsYearlyData] = useState<Omit<YearlyData, "invested">[]>([]);

	// SIP parameters
	const [sipYears, setSipYears] = useState(5);
	const [sipAmount, setSipAmount] = useState(5_000);
	const [sipReturnRate, setSipReturnRate] = useState(10);
	const [sipYearlyData, setSipYearlyData] = useState<YearlyData[]>([]);
	const [annualIncrease, setAnnualIncrease] = useState(false);
	const [annualIncreaseRate, setAnnualIncreaseRate] = useState(5);

	// UI state
	const [isDark, setIsDark] = useState(false);

	// Calculate Lump Sum Returns
	useEffect(() => {
		const data = [];
		let currentAmount = lsAmount;
		for (let i = 1; i <= lsYears; i++) {
			currentAmount = currentAmount * (1 + lsReturnRate / 100);
			data.push({
				year: i,
				amount: Math.round(currentAmount),
			});
		}
		setLsYearlyData(data);
	}, [lsYears, lsAmount, lsReturnRate]);

	// Calculate SIP Returns
	useEffect(() => {
		const data = [];
		let totalInvested = 0;
		let currentAmount = 0;
		let monthlySipAmount = sipAmount;

		for (let year = 1; year <= sipYears; year++) {
			for (let month = 1; month <= 12; month++) {
				// Add monthly SIP amount
				currentAmount += monthlySipAmount;
				totalInvested += monthlySipAmount;

				// Apply monthly returns (annual rate divided by 12)
				currentAmount = currentAmount * (1 + sipReturnRate / 1200);
			}

			data.push({
				year,
				amount: Math.round(currentAmount),
				invested: Math.round(totalInvested),
			});

			// Increase SIP amount for next year if enabled
			if (annualIncrease) {
				monthlySipAmount = monthlySipAmount * (1 + annualIncreaseRate / 100);
			}
		}

		setSipYearlyData(data);
	}, [sipYears, sipAmount, sipReturnRate, annualIncrease, annualIncreaseRate]);

	// Dynamic data based on selected investment type
	const yearlyData = investmentType === "lumpsum" ? lsYearlyData : sipYearlyData;
	const initialInvestment =
		investmentType === "lumpsum"
			? lsAmount
			: sipYearlyData.length > 0
				? sipYearlyData[sipYearlyData.length - 1].invested
				: 0;
	const totalReturns = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].amount : 0;
	const totalGains = totalReturns - initialInvestment;
	const percentageGained =
		initialInvestment > 0 ? ((totalReturns - initialInvestment) / initialInvestment) * 100 : 0;

	const pieData = [
		{ name: "Invested Amount", value: initialInvestment },
		{ name: "Returns", value: totalGains > 0 ? totalGains : 0 },
	];

	const COLORS = ["hsl(var(--primary))", "hsl(var(--primary) / 0.5)"];

	const formatCurrency = (value?: number) => {
		if (value === undefined) return "₹0";

		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
			maximumFractionDigits: 0,
		}).format(value);
	};

	const toggleTheme = () => {
		setIsDark(!isDark);
		document.documentElement.classList.toggle("dark");
	};

	return (
		<div className="min-h-screen p-4 sm:p-8 transition-colors">
			<Card className="max-w-4xl mx-auto p-6 space-y-8">
				{/* Top Section */}
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<BlurFade delay={BLUR_FADE_DELAY} className="relative">
							<motion.h1
								className="text-6xl font-bold"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, ease: "easeOut" }}
							>
								A<span className="text-3xl font-bold">CRE - Smart Returns</span>
							</motion.h1>
							<UnderlineGrow className="my-0" />
						</BlurFade>

						<BlurFade delay={BLUR_FADE_DELAY}>
							<Button variant="ghost" size="icon" onClick={toggleTheme} className="cursor-pointer">
								{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
							</Button>
						</BlurFade>
					</div>

					<BlurFade delay={BLUR_FADE_DELAY * 2}>
						<Tabs
							value={investmentType}
							onValueChange={(value) => setInvestmentType(value as "sip" | "lumpsum")}
							className="w-full"
						>
							<TabsList className="grid w-full grid-cols-2 mb-6">
								<TabsTrigger value="lumpsum">
									<PiggyBank className="h-4 w-4 mr-2" /> Lump Sum
								</TabsTrigger>
								<TabsTrigger value="sip">
									<TrendingUp className="h-4 w-4 mr-2" /> SIP
								</TabsTrigger>
							</TabsList>

							<TabsContent value="lumpsum" className="space-y-6">
								<div className="grid gap-6 sm:grid-cols-2">
									<div className="space-y-4">
										<div className="flex flex-col gap-4">
											<Label>Investment Period (Years): {lsYears}</Label>
											<Slider
												value={[lsYears]}
												onValueChange={(value) => setLsYears(value[0])}
												min={1}
												max={30}
												step={1}
											/>
										</div>

										<div className="flex flex-col gap-4">
											<Label>Initial Investment: {formatCurrency(lsAmount)}</Label>
											<Slider
												value={[lsAmount]}
												onValueChange={(value) => setLsAmount(value[0])}
												min={1_000}
												max={1_00_00_000}
												step={1_000}
											/>
										</div>

										<div className="flex flex-col gap-4">
											<Label>Return Rate: {lsReturnRate}%</Label>
											<Slider
												value={[lsReturnRate]}
												onValueChange={(value) => setLsReturnRate(value[0])}
												min={1}
												max={30}
												step={0.5}
											/>
										</div>
									</div>

									<div className="space-y-4">
										<motion.div
											className="p-6 rounded-lg bg-primary/5 text-center"
											animate={{ scale: [0.95, 1] }}
											transition={{ duration: 0.3 }}
										>
											<div className="text-sm text-muted-foreground">Total Returns</div>
											<div className="text-3xl font-bold mt-2">{formatCurrency(totalReturns)}</div>
											<div className="text-sm text-primary mt-2">
												{percentageGained.toFixed(2)}% gain
											</div>
										</motion.div>
									</div>
								</div>
							</TabsContent>

							<TabsContent value="sip" className="space-y-6">
								<div className="grid gap-6 sm:grid-cols-2">
									<div className="space-y-4">
										<div className="flex flex-col gap-4">
											<Label>Investment Period (Years): {sipYears}</Label>
											<Slider
												value={[sipYears]}
												onValueChange={(value) => setSipYears(value[0])}
												min={1}
												max={30}
												step={1}
											/>
										</div>

										<div className="flex flex-col gap-4">
											<Label>Monthly SIP Amount: {formatCurrency(sipAmount)}</Label>
											<Slider
												value={[sipAmount]}
												onValueChange={(value) => setSipAmount(value[0])}
												min={500}
												max={100000}
												step={500}
											/>
										</div>

										<div className="flex flex-col gap-4">
											<Label>Return Rate: {sipReturnRate}%</Label>
											<Slider
												value={[sipReturnRate]}
												onValueChange={(value) => setSipReturnRate(value[0])}
												min={1}
												max={30}
												step={0.5}
											/>
										</div>

										<div className="flex justify-between items-center">
											<Label>Annual SIP Increase</Label>
											<Switch checked={annualIncrease} onCheckedChange={setAnnualIncrease} />
										</div>

										{annualIncrease && (
											<div className="flex flex-col gap-4">
												<Label>Annual Increase Rate: {annualIncreaseRate}%</Label>
												<Slider
													value={[annualIncreaseRate]}
													onValueChange={(value) => setAnnualIncreaseRate(value[0])}
													min={1}
													max={20}
													step={1}
												/>
											</div>
										)}
									</div>

									<div className="space-y-4">
										<motion.div
											className="p-6 rounded-lg bg-primary/5 text-center"
											animate={{ scale: [0.95, 1] }}
											transition={{ duration: 0.3 }}
										>
											<div className="text-sm text-muted-foreground">Total Returns</div>
											<div className="text-3xl font-bold mt-2">{formatCurrency(totalReturns)}</div>
											<div className="flex justify-between mt-2">
												<span className="text-sm">
													Total Invested: {formatCurrency(initialInvestment)}
												</span>
												<span className="text-sm text-primary">
													{percentageGained.toFixed(2)}% gain
												</span>
											</div>
										</motion.div>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</BlurFade>
				</div>

				{/* Middle Section - Charts */}
				<div className="space-y-8">
					{/* Pie Chart */}
					<BlurFade delay={BLUR_FADE_DELAY * 8} className="h-[250px]">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={pieData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={100}
									paddingAngle={5}
									dataKey="value"
									animationBegin={0}
									animationDuration={1500}
								>
									{pieData.map((_entry, index) => (
										<Cell key={`cell-${_entry.name}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									content={({ active, payload }) => {
										if (!active || !payload || payload.length === 0) return null;

										return (
											<div className="p-2 bg-white dark:bg-black text-black dark:text-white rounded shadow-md">
												<p>{`${payload[0].name}: ${formatCurrency(Number(payload[0].value))}`}</p>
											</div>
										);
									}}
								/>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</BlurFade>

					{/* Bar Chart */}
					<BlurFade delay={BLUR_FADE_DELAY * 12} className="h-[250px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={yearlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" />
								<XAxis dataKey="year" tick={{ fontSize: 12 }} />
								<YAxis
									tick={{ fontSize: 12 }}
									tickFormatter={(value) => {
										if (value >= 1_00_00_00_000) return `${(value / 1_00_00_00_000).toFixed(2)}Ar`; // 100 Crores+
										if (value >= 1_00_00_000) return `${(value / 1_00_00_000).toFixed(2)}Cr`; // 1 Crore+
										if (value >= 1_00_000) return `${(value / 1_00_000).toFixed(2)}L`; // 1 Lakh+
										if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`; // 1 Thousand+
										return value;
									}}
								/>
								<Tooltip
									content={({ active, payload, label }) => {
										if (!active || !payload || payload.length === 0) return null;

										return (
											<div className="p-2 bg-white dark:bg-black text-black dark:text-white rounded shadow-md">
												<p className="font-semibold">{`Year ${label}`}</p>
												<p>Value: {formatCurrency(Number(payload[0].value))}</p>
												{investmentType === "sip" && (
													<p>Invested: {formatCurrency(Number(payload[0].payload.invested))}</p>
												)}
											</div>
										);
									}}
								/>
								<Bar dataKey="amount" fill="hsl(var(--primary))">
									{yearlyData.map((_entry, index) => (
										<Cell
											key={`cell-${_entry.year}`}
											fill={`hsl(var(--primary) / ${0.3 + (index / yearlyData.length) * 0.7})`}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</BlurFade>
				</div>

				{/* Bottom Section - Table */}
				<BlurFade delay={BLUR_FADE_DELAY * 16} className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b">
								<th className="text-left py-2">Year</th>
								<th className="text-right py-2">Value</th>
								{investmentType === "sip" && <th className="text-right py-2">Invested</th>}
								<th className="text-right py-2">Returns</th>
							</tr>
						</thead>
						<tbody>
							{yearlyData.map((data, index) => (
								<motion.tr
									key={data.year}
									className="border-b"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
								>
									<td className="py-2">Year {data.year}</td>
									<td className="text-right py-2">{formatCurrency(data.amount)}</td>
									{investmentType === "sip" && (
										<td className="text-right py-2">
											{formatCurrency((data as YearlyData).invested)}
										</td>
									)}
									<td className="text-right py-2 text-primary">
										{formatCurrency(
											data.amount -
												(investmentType === "lumpsum" ? lsAmount : (data as YearlyData).invested)
										)}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</BlurFade>
			</Card>
		</div>
	);
}
