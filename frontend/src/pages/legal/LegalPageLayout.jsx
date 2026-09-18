import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

/**
 * Shared shell for the legal pages so Privacy/Terms/Cookies stay visually consistent
 * and each page file contains only its own copy.
 */
const LegalPageLayout = ({ title, lastUpdated, children }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col">
    <Header />
    <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-3xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">{title}</h1>
        <p className="text-sm text-slate-500 mb-10">Last updated: {lastUpdated}</p>
        <div className="prose-legal space-y-6 text-slate-600 leading-relaxed">{children}</div>
      </div>
    </main>
    <Footer />
  </div>
);

export const LegalSection = ({ heading, children }) => (
  <section>
    <h2 className="text-xl font-bold text-slate-900 mb-3">{heading}</h2>
    <div className="space-y-3">{children}</div>
  </section>
);

export default LegalPageLayout;
