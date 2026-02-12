import SplashScreen from "./components/SplashScreen";
import HomeScreen from "./Home/page";

export default function Home() {
  return (
    <SplashScreen>
      <HomeScreen />
    </SplashScreen>
  );
}