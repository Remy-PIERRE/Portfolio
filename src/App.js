import Layout from "./Pages/Layout";
import { UserProvider } from "./Context/UserContext";
import { ToggleLoadingProvider } from "./Context/ToggleLoadingContext";
import { DataProvider } from "./Context/DataContext";
import { GalleryProvider } from "./Context/GalleryContext";

function App() {
  return (
    <>
      <ToggleLoadingProvider>
        <UserProvider>
          <DataProvider>
            <GalleryProvider>
              <Layout />
            </GalleryProvider>
          </DataProvider>
        </UserProvider>
      </ToggleLoadingProvider>
    </>
  );
}

export default App;
