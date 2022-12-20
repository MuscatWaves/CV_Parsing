import "./app.css";
import Routing from "./routes";
import { QueryClientProvider, QueryClient } from "react-query";
import { ConfigProvider } from "antd";
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const handleContextmenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextmenu);
    return function cleanup() {
      document.removeEventListener("contextmenu", handleContextmenu);
    };
  }, []);

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#f07d00",
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <Routing />
        </QueryClientProvider>
      </ConfigProvider>
    </div>
  );
};

export default App;
