// AppLayout.jsx
import TopMenuBar from "./TopMenuBar";

export default function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopMenuBar />
      <main className="tonomy-bankless-container">
        {children}
      </main>
    </div>
  );
}
