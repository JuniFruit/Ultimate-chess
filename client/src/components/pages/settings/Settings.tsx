import { FC } from 'react';
import { setTabTitle } from '../../../utils/general.utils';
import Wrapper from "../../ui/wrapper/Wrapper";
import { SettingsComp } from "./SettingsComp";

const Settings: FC = () => {

    setTabTitle("Ultimate Chess Audio Settings")
    return (
        <Wrapper title="Audio Settings">
            <SettingsComp />
        </Wrapper>
    )
}

export default Settings;