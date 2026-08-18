/**
 * PageHeader — reusable page-level header with title, subtitle, and optional actions.
 *
 * Usage:
 *   <PageHeader
 *     title="Teacher Management"
 *     subtitle="Review and approve teacher profiles"
 *     actions={<button className="btn-primary">+ Add</button>}
 *   />
 */
const PageHeader = ({ title, subtitle, actions, icon: Icon }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
  </div>
);

export default PageHeader;
