import Uik from "@reef-defi/ui-kit";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export const CustomInput = ({ text, toolTipText, onChange, value }) => {
    return <>
        <><br /></>
        <Uik.Container vertical flow="start">
            <Uik.Tooltip text={toolTipText}>
                <Uik.Container flow="start">
                    <Uik.Text text={text} type="light" />
                    <Uik.Icon icon={faCircleInfo} />
                </Uik.Container>
            </Uik.Tooltip>
            <Uik.Input
                onChange={e => onChange(e.target.value)}
                value={value}
            />
        </Uik.Container>
    </>
}