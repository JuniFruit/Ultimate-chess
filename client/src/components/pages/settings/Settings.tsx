import { FC } from 'react';
import { Layout } from "../../layout/Layout";
import Wrapper from "../../ui/wrapper/Wrapper";
import { SettingsComp } from "./SettingsComp";

const Settings: FC = () => {  
   

    return (
        <Layout title="Ultimate Chess Audio Settings">
            <Wrapper title="Audio Settings">
                <SettingsComp />
            </Wrapper>
        </Layout >
    )
}

export default Settings;