import Navbar from "../components/Navbar";

function PageShell({ children }) {
  return (
    <div className="min-h-screen text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">{children}</main>
    </div>
  );
}

export default PageShell;
