
import Clasificar from "./pages/clasificar/clasificar";
import Empty from "./pages/empty/Empty";
import Grafico1 from "./pages/graficos/grafico1";
import Home from "./pages/home/Home";
import Kdtree from "./pages/kdtree/kdtree";
import main from "./pages/management/main/main";

const routePath = [
    {path: '/home', component: Home},
    {path: '/empty', component: Empty},

    {path: '/clasificar', component: Clasificar},
    {path: '/planokd', component: Kdtree},
    {path: '/score', component: Empty},

    {path: '/otros/grafico1', component: Grafico1},
    

    {path: '/manage/main', component: main},

    
    {path: '/', component: Home},
    {path: '*', component: Home}

];

export default routePath;