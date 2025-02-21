"use client";

import { useState, useEffect } from "react";

import { motion } from "motion/react";

import { Moon, Sun } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";

import { BlurFade } from "@/components/animated/BlurFade";
import { UnderlineGrow } from "@/components/animated/UnderlineGrow";

import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { BLUR_FADE_DELAY } from "@/constants/ui";

export default function ReturnCalculator() {
	const [years, setYears] = useState(5);
	const [amount, setAmount] = useState(5000);
	const [returnRate, setReturnRate] = useState(10);
	const [isDark, setIsDark] = useState(false);
	const [yearlyData, setYearlyData] = useState<{ year: number; amount: number }[]>([]);

	useEffect(() => {
		const data = [];
		let currentAmount = amount;
		for (let i = 1; i <= years; i++) {
			currentAmount = currentAmount * (1 + returnRate / 100);
			data.push({
				year: i,
				amount: Math.round(currentAmount),
			});
		}
		setYearlyData(data);
	}, [years, amount, returnRate]);

	const totalReturns = yearlyData[yearlyData.length - 1]?.amount || amount;
	const totalGains = totalReturns - amount;
	const percentageGained = ((totalReturns - amount) / amount) * 100;

	const pieData = [
		{ name: "Initial Investment", value: amount },
		{ name: "Returns", value: totalGains },
	];

	const COLORS = ["hsl(var(--primary))", "hsl(var(--primary) / 0.5)"];

	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat("en-US", {
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
						{/* Wrap heading and underline together */}

						<BlurFade delay={BLUR_FADE_DELAY} className="relative">
							<motion.h1
								className="text-6xl font-bold"
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, ease: "easeOut" }}
							>
								A<span className="text-3xl font-bold">CRE - Smart Returns</span>
							</motion.h1>
							{/* Position the underline correctly below the text */}
							<UnderlineGrow className="my-0" />
						</BlurFade>

						{/* Theme toggle button */}
						<BlurFade delay={BLUR_FADE_DELAY}>
							<Button variant="ghost" size="icon" onClick={toggleTheme}>
								{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
							</Button>
						</BlurFade>
					</div>

					<BlurFade delay={BLUR_FADE_DELAY * 4} className="grid gap-6 sm:grid-cols-2">
						<div className="space-y-2">
							<div className="flex flex-col gap-4">
								<Label>Investment Period (Years): {years}</Label>
								<div>
									<Slider
										value={[years]}
										onValueChange={(value) => setYears(value[0])}
										min={1}
										max={30}
										step={1}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-4">
								<Label>Initial Investment: {formatCurrency(amount)}</Label>
								<div>
									<Slider
										value={[amount]}
										onValueChange={(value) => setAmount(value[0])}
										min={1000}
										max={1000000}
										step={1000}
									/>
								</div>
							</div>

							<div className="flex flex-col gap-4">
								<Label>Return Rate: {returnRate}%</Label>
								<div>
									<Slider
										value={[returnRate]}
										onValueChange={(value) => setReturnRate(value[0])}
										min={1}
										max={30}
										step={0.5}
									/>
								</div>
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
								<div className="text-sm text-primary mt-2">{percentageGained.toFixed(2)}% gain</div>
							</motion.div>
						</div>
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
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip
									content={({ active, payload }) => {
										if (!active || !payload || payload.length === 0) return null;

										return (
											<div className="p-2 bg-white dark:bg-black text-black dark:text-white rounded shadow-md">
												<p>{formatCurrency(Number(payload[0].value))}</p>
											</div>
										);
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					</BlurFade>

					{/* Bar Chart */}
					<BlurFade delay={BLUR_FADE_DELAY * 12} className="h-[250px]">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={yearlyData}>
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
												<p>{formatCurrency(Number(payload[0].value))}</p>
											</div>
										);
									}}
								/>
								<Bar dataKey="amount" fill="hsl(var(--primary))">
									{yearlyData.map((_entry, index) => (
										<Cell
											key={`cell-${index}`}
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
								<th className="text-right py-2">Amount</th>
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
									<td className="text-right py-2 text-primary">
										{formatCurrency(data.amount - amount)}
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
