// import Header from "components/views/Header";
import AppRouter from "components/routing/routers/AppRouter";
// import Frame from "components/ui/Frame"
// import WoodyBackground from "components/ui/WoodyBackground";

/**
 * Happy coding!
 * React Template by Lucas Pelloni
 * Overhauled by Kyrill Hux
 */
const App = () => {
  return (
    <div style={{height: "100vh"}}>
      {/* <Frame> */}
        {/* <Header height="100"/> */}
        <AppRouter/>
      {/* </Frame> */}
    </div>
  );
};

export default App;
