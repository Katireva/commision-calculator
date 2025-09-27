import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Tier = { min: number; max?: number; rate: number };

const tiers: Tier[] = [
  { min: 0, max: 5000, rate: 0 },
  { min: 5000, max: 10000, rate: 0.1 },
  { min: 10000, max: 15000, rate: 0.15 },
  { min: 15000, max: 20000, rate: 0.2 },
  { min: 20000, rate: 0.25 },
];

function calculateCommission(revenue: number) {
  let total = 0;
  const breakdown: { range: string; amount: number }[] = [];

  for (const t of tiers) {
    const upper = t.max ?? revenue;

    console.info("upper = ", upper);

    if (revenue > t.min) {
      const taxable = Math.min(revenue, upper) - t.min;

      console.info("taxable = ", taxable);

      const earned = taxable * t.rate;

      console.info("earned = ", earned);

      total += earned;
      breakdown.push({
        range: t.max
          ? `${t.min.toLocaleString()} – ${t.max.toLocaleString()}`
          : `${t.min.toLocaleString()}+`,
        amount: earned,
      });
    } else {
      breakdown.push({
        range: t.max
          ? `${t.min.toLocaleString()} – ${t.max.toLocaleString()}`
          : `${t.min.toLocaleString()}+`,
        amount: 0,
      });
    }
  }
  return { total, breakdown };
}

const CommissionCalculator: React.FC = () => {
  const [revenue, setRevenue] = useState<number>(25000);
  const { total, breakdown } = useMemo(
    () => calculateCommission(revenue),
    [revenue]
  );

  return (
    <Card className="max-w-md mx-auto rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle>Commission Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="revenue" className="sr-only">
          Revenue
        </Label>
        <div className="flex items-center mb-4">
          <span className="px-3 py-2 bg-gray-100 border border-r-0 rounded-l-md">
            £
          </span>
          <Input
            id="revenue"
            type="number"
            min={0}
            step={100}
            className="rounded-l-none"
            value={revenue}
            onChange={(e) => setRevenue(Number(e.target.value))}
          />
        </div>

        <p className="text-lg font-semibold mb-3">
          Total Commission: £{total.toFixed(2)}
        </p>

        <div className="border-t pt-3 text-sm">
          <div className="grid grid-cols-2 font-semibold mb-2">
            <span>Band Range</span>
            <span className="text-right">Commission Earned</span>
          </div>
          {breakdown.map((b) => (
            <div
              key={b.range}
              className="grid grid-cols-2 py-1 border-b last:border-b-0"
            >
              <span>{b.range}</span>
              <span className="text-right">£{b.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionCalculator;
