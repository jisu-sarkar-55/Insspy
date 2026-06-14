import { TradeForm } from "@/components/trades/trade-form";

export default function NewTradePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Add New Trade</h1>
        <p className="text-zinc-400 mt-1">
          Record the details of your trade
        </p>
      </div>
      <TradeForm />
    </div>
  );
}
