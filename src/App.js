import "./app.css";
import Routing from "./routes";
import { QueryClientProvider, QueryClient } from "react-query";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient();

const App = () => {
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
