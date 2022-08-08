import "./app.css";
import Routing from "./routes";
import {QueryClientProvider, QueryClient} from "react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div className="App">
        <header className="App-header">
          <QueryClientProvider client={queryClient}>
            <Routing/>
          </QueryClientProvider>
        </header>
    </div>
  );
}

export default App;
