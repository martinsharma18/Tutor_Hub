import SectionCard from "../../components/ui/SectionCard";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
        </div>
        <p className="text-purple-100">Platform insights and performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SectionCard title="Growth Rate" className="text-center">
          <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-slate-900">+24%</div>
          <p className="text-sm text-slate-500 mt-2">This month</p>
        </SectionCard>
        <SectionCard title="Active Sessions" className="text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-slate-900">0</div>
          <p className="text-sm text-slate-500 mt-2">Currently online</p>
        </SectionCard>
        <SectionCard title="Revenue" className="text-center">
          <DollarSign className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-slate-900">$0</div>
          <p className="text-sm text-slate-500 mt-2">This month</p>
        </SectionCard>
        <SectionCard title="Engagement" className="text-center">
          <BarChart3 className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-3xl font-bold text-slate-900">0%</div>
          <p className="text-sm text-slate-500 mt-2">User engagement</p>
        </SectionCard>
      </div>

      <SectionCard title="Analytics Dashboard">
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500">Analytics dashboard coming soon</p>
          <p className="text-sm text-slate-400 mt-2">View detailed reports, charts, and insights</p>
        </div>
      </SectionCard>
    </div>
  );
};

export default AnalyticsPage;



