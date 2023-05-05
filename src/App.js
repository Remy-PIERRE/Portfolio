import Layout from "./Pages/Layout";
import { UserProvider } from "./Context/UserContext";
import { ToggleLoadingProvider } from "./Context/ToggleLoadingContext";
import { DataProvider } from "./Context/DataContext";

function App() {
  return (
    <>
      <ToggleLoadingProvider>
        <UserProvider>
          <DataProvider>
            <Layout />
          </DataProvider>
        </UserProvider>
      </ToggleLoadingProvider>
    </>
  );
}

export default App;
