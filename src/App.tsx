import React from "react";
import "@/assets/style/index.scss";
import FooterComponent from "@/components/Footer";
import HeaderComponent from "@/components/Header";
import { TodosProvider } from "@/context/TodosContext";
import TodoDisplayComponent from "@/components/Screen/TodoDisplay";

export const App: React.FC = () => { 
  return(
    <>
      <TodosProvider>
        <HeaderComponent />
        <TodoDisplayComponent />
        <FooterComponent />
      </TodosProvider>
    </>
  );
};

export default App;
