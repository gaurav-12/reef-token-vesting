import Uik from "@reef-defi/ui-kit";
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

export const CustomToggle = ({ text, toolTipText, onChange, value }) => {
    return <>
        <><br /></>
        <Uik.Container vertical flow="start">
            <Uik.Tooltip text={toolTipText}>
                <Uik.Container flow="start">
                    <Uik.Text text={text} type="light" />
                    <Uik.Icon icon={faCircleInfo} />
                </Uik.Container>
            </Uik.Tooltip>
            <Uik.Toggle
                onText="Yes"
                offText="No"
                onChange={e => onChange(e)}
                value={value}
            />
        </Uik.Container>
    </>
}