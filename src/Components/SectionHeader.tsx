interface SectionHeaderProps {
  title: string;
  icon: React.ElementType;
  count: number;
  accentColor: string;
}

export function SectionHeader({ title, icon: Icon, count, accentColor }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${accentColor} shadow-md`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
        {count}
      </span>
    </div>
  );
}