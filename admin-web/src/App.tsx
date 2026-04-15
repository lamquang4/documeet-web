import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/ScrollToTop";
import LayoutRoute from "./LayoutRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 phút
      gcTime: 1000 * 60 * 5, // xóa cache khỏi bộ nhớ sau 5 phút
      retry: false,
      refetchOnWindowFocus: false, // tắt chuyển tab rồi quay lại không gọi API
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster />
        <ScrollToTop />
        <LayoutRoute />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
