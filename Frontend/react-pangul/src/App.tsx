import * as React from 'react';
import AppRoutesTest from "./packages/react-pangul-app/src/app/appRoutes/appRoutesTest";
import { LayoutTheme } from "./packages/react-pangul-app/src/components/layout/layoutTheme/layoutTheme";
import { configureApplication } from "./packages/react-pangul-app/src/infrastructure/service/settingsProvider";

configureApplication({
    backendUrl: 'http://localhost:5000',
    baseUrl: '',
    footerNotice: 'hello!',
    test: {
        testUser: "admin",
        testUserAuth: "admin",
        testUserEnabled: true
    }
});

class App extends React.Component {
    public render() {
        return (
            <LayoutTheme>
                <AppRoutesTest test={true}/>
            </LayoutTheme>
        );
    }
}

export default App;
