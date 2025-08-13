// AppLayout.jsx
import TopMenuBar from "./TopMenuBar";

export default function AppLayout({ children, page = undefined }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopMenuBar page={page} />
      <main className="tonomy-bankless-container">
        {children}
      </main>
    </div>
  );
}
