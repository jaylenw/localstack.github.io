import { customizers } from 'react-material-dashboard/src/common/customizers';

const resolveComponent = (componentClass) => {
    const className = componentClass.name;
    if(className === 'Sidebar')
        return require('./components/sidebar').Sidebar;
    if(className === 'Footer')
        return require('./components/footer').Footer;
    if(className === 'Dashboard')
        return require('./components/dashboard').Dashboard;
    if(className === 'Topbar')
        return require('./components/topbar').Topbar;
    if(className === 'SignIn')
        return require('./components/signin').defineSignInComponent(componentClass);
    if(className === 'SignUp')
        return require('./components/signin').defineSignUpComponent(componentClass);
    return componentClass;
};

if (!customizers.customizeComponent._updated) {
    customizers.customizeComponent = (comp, styles) => {
        const newComp = resolveComponent(comp);
        let newStyles = styles;
        if (styles && newComp.styles) {
            newStyles = (comp) => {
                const result = styles(comp);
                Object.assign(result, newComp.styles);
                return result;
            }
        }
        return [newComp, newStyles];
    };

    customizers.customizeComponent._updated = true;
}
