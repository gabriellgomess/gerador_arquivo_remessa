import { ConfigProvider } from "antd";
import pt_BR from "antd/locale/pt_BR";

import ImportadorExcel from "./component/ImportadorExcel";
import GeradorCNAB150 from "./component/GeradorCNAB150";
const App = () => {

  // Definindo tokens de design personalizados
const theme = {
  components: {
    Segmented: {
      itemSelectedBg: '#d0872b',
      itemSelectedColor: '#fff',
    },
    Button: {
      colorPrimary: '#d0872b',
      colorPrimaryHover: '#f9b967',
      colorPrimaryActive: '##935302',
      colorPrimaryFocus: '##935302',

    },
    Input: {
      colorPrimary: '#d0872b',
      colorPrimaryActive: '##935302',
      colorPrimaryFocus: '##935302',
      colorPrimaryHover: '#f9b967',
    },
    Select: {
      colorPrimary: '#d0872b',
      colorPrimaryActive: '##935302',
      colorPrimaryFocus: '##935302',
      colorPrimaryHover: '#f9b967',
    },  
    Tabs: {
      colorPrimary: '#d0872b',
      colorPrimaryActive: '##935302',
      colorPrimaryFocus: '##935302',
      colorPrimaryHover: '#f9b967',
    },
    DatePicker: {
      colorPrimary: '#d0872b',
      colorPrimaryActive: '##935302',
      colorPrimaryFocus: '##935302',
      colorPrimaryHover: '#f9b967',
    }  
  },
};

  return (
    <ConfigProvider theme={theme} locale={pt_BR}>
      {/* <ImportadorExcel /> */}
      <GeradorCNAB150 />
    </ConfigProvider>
  );
}

export default App;