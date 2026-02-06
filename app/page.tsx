import SplashScreen from "./components/SplashScreen";
import HomeScreen from "./src/pages/Home";

export default function Home() {
  return (
    <SplashScreen>
      <HomeScreen />
    </SplashScreen>
  );
}