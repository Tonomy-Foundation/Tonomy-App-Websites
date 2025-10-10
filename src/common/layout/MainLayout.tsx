// AppLayout.jsx
import TopMenuBar from "./TopMenuBar";

type AppLayoutProps = {
  children: React.ReactNode;
  page?: string;
};

export default function AppLayout({ children, page }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopMenuBar page={page} />
      <main className="tonomy-bankless-container">{children}</main>
    </div>
  );
}
